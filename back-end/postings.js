const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const users = require("./users.js");

//
// Postings
//

const User = users.model;
const validUser = users.valid;

// This is the schema for a posting
const postingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  post: String,
  created: {
    type: Date,
    // default: Date.now
  },
  likeCount: Number,
  dislikeCount: Number,
});

// The model for a posting
const Posting = mongoose.model('Posting', postingSchema);

// get postings -- will list postings that a user has submitted
router.get('/', validUser, async (req, res) => {
  let postings = [];
  try {
    if (req.user.role === "admin") {
      postings = await Posting.find().sort({
        created: -1
      });
    } else {
      postings = await Posting.find({
        user: req.user
      }).sort({
        created: -1
      });
    }
    return res.send({
      postings: postings
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// create a posting
router.post('/', validUser, async (req, res) => {
  const posting = new Posting({
    user: req.user,
    post: req.body.post,
    likeCount: req.body.likeCount,
    dislikeCount: req.body.dislikeCount,
    created: new Date().toLocaleString()
  });
  try {
    await posting.save();
    return res.send({
      posting: posting
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// edit a posting -- only edits status and response
router.put('/:id', validUser, async (req, res) => {
  // can only do this if an administrator
  if (!req.body.post) {
    return res.status(400).send({
      message: "text required"
    });
  }
  try {
    posting = await Posting.findOne({
      _id: req.params.id
    });
    posting.post = req.body.post;
    posting.likeCount = req.body.likeCount
    posting.dislikeCount = req.body.dislikeCount
    await posting.save();
    return res.send({
      posting: posting
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Posting.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = {
  routes: router
}

