<template>
  <div class="main">
    <h2>Logged in as: {{user.firstName}} {{user.lastName}} <button @click="logout" class="pure-button pure-button-primary">Logout</button></h2>
    <h1>Posts</h1>
    <div>
      <button @click="setCreating" class="pure-button button-xsmall">
        <i class="fas fa-plus" />
      </button>
    </div>
    <form class="pure-form" v-if="creating || postings.length > 0" @submit.prevent="addPosting">
      <legend>{{new Date().toLocaleString()}}</legend>
      <fieldset>
        <textarea v-model="post"></textarea>
        <br />
        <button class="pure-button pure-button-primary" type="submit">Submit</button>
      </fieldset>
    </form>

    <div v-if="postings.length === 0">
      <br>
      <br>
      <p class="noPostsMessage">No posts here! Add some above.</p>
    </div>

    <section class="posts">


    <div v-for="posting in postings" v-bind:key="posting.id">
      <div class="posting">
        <div class="post">
          <p class = "fancy-heading">{{posting.post}}</p>

          <p class="fancy-subheading-mini">Likes: {{posting.likeCount}} Dislikes: {{posting.dislikeCount}}</p>
          <h3>Posted {{time(posting.created)}}</h3>
          <button class="button2" @click="increaseLikeCount(posting)">Like</button>
          <button class="button2" @click="increaseDislikeCount(posting)">Dislike</button>
          <hr class = "invisible">

          <button class="fancy-button" @click="deletePost(posting)">Delete Post</button>
          <button class="fancy-button" @click="showEditField = !showEditField">Edit</button>
        </div>
                    <div v-if="showEditField === true">

          <textarea v-model="posting.post">
            </textarea>
          <button @click="editPost(posting)">Save Edits</button>

                    </div>
      </div>
    </div>

    </section>


  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
  name: 'MyPostings',
  data() {
    return {
      creating: false,
      post: '',
      postings: [],
      showEditField: false,
      likeCount: 0,
      dislikeCount: 0

    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  },
  created() {
    this.getPostings();
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    async getPostings() {
      try {
        let response = await axios.get("/api/postings");
        this.postings = response.data.postings;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async increaseLikeCount(posting) {
      try {
        await axios.put("/api/postings/" + posting._id, {
          post: posting.post,
          likeCount: posting.likeCount + 1,
          dislikeCount: posting.dislikeCount,
        });
        this.post = null;
        this.getPostings();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async increaseDislikeCount(posting) {
      try {
        await axios.put("/api/postings/" + posting._id, {
          post: posting.post,
          likeCount: posting.likeCount,
          dislikeCount: posting.dislikeCount + 1,
        });
        this.post = null;
        this.getPostings();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editPost(posting) {
      try {
        await axios.put("/api/postings/" + posting._id, {
          post: posting.post,
          // creat: posting.content,
          likeCount: posting.likeCount,
          dislikeCount: posting.dislikeCount,
        });
        this.showEditField = !this.showEditField //Make edit field disappear
        this.post = null;
        this.creating = false;
        this.getPostings();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    time(d) {
      return moment(d).format('D MMMM YYYY, h:mm:ss a');
    },
    setCreating() {
      this.creating = true;
    },
    cancelCreating() {
      this.creating = false;
    },
    async addPosting() {
      try {
        await axios.post("/api/postings", {
          post: this.post,
          likeCount: this.likeCount,
          dislikeCount: this.dislikeCount,
        });
        this.post = "";
        this.creating = false;
        this.getPostings();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deletePost(posting) {
      try {
        await axios.delete("/api/postings/" + posting._id);
        this.post = null;
        this.creating = false;
        this.getPostings();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
}
</script>

<style scoped>
textarea {
  width: 100%;
  max-width: 500px;
}

h3 {
  font-size: 12px;
  font-weight: normal;
  background-color: #ccc;
  padding: 10px 20px;
}


label {
  background-color: #000;
  color: white;
  padding: 5px;
  border-radius: 30px;
  font-size: 12px;
  margin-right: 10px;
}

.posting {}







/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}

.post {
  column-gap: 1.5em;
}

.post {
  box-shadow: -10px -10px 30px 4px rgba(0,0,0,0.1),
  10px 10px 30px 4px rgba(45,78,255,0.15);
}

.box {
  border: 1px solid green ;
}




.post .fancy-subheading {
  font-family: Arial;
  font-size: 20px;
}

.post .fancy-subheading-super-mini {
  font-family: Arial;
  font-size: 12px;
}

.invisible {
  opacity: 0;
  margin-top: -4px;
}



.noPostsMessage {
  box-shadow: -10px -10px 30px 4px rgba(0,0,0,0.1),
  10px 10px 30px 4px rgba(45,78,255,0.15);
  color: gray;
  background-color: white;
}

/*.post .fancy-button {*/
/*  background: #fff;*/
/*  color: #666;*/
/*  padding: 1.5em;*/
/*}*/

/*.post .button2 {*/
/*  background: darkgray;*/
/*  color: #666;*/
/*  padding: 0.8em;*/
/*}*/

/* Masonry on large screens */
@media only screen and (min-width: 1024px) {
  .post {
    background: #666;
    color: #fff;
    text-align: center;
    border: 5px solid #444;
    border-radius: 5px;
    /*padding: 10px;*/
    margin: 1em 0;
    width:30%;
  }

  .post .fancy-button {
    background: #fff;
    color: #666;
    padding: 1.5em;
  }

  .post .button2 {
    background: darkgray;
    color: #666;
    padding: 0.8em;
  }

  .post .fancy-heading {
    font-family: Arial;
    font-size: 32px;
    color: white;
    margin-bottom: 10px;
    font-style: italic;
    /*font-style: oblique;*/
    overflow-wrap: break-word;
  }
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .post {
    background: #666;
    color: #fff;
    text-align: center;
    border: 5px solid #444;
    border-radius: 5px;
    /*padding: 10px;*/
    margin: 1em 0;
    width:60%;
  }

  .post .fancy-button {
    background: #fff;
    color: #666;
    padding: 1em;
  }

  .post .button2 {
    background: darkgray;
    color: #666;
    padding: 0.5em;
  }

  .post .fancy-heading {
    font-family: Arial;
    font-size: 30px;
    color: white;
    margin-bottom: 10px;
    font-style: italic;
    /*font-style: oblique;*/
    overflow-wrap: break-word;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 140px) {
  .post {
    background: #666;
    color: #fff;
    text-align: center;
    border: 5px solid #444;
    border-radius: 5px;
    /*padding: 10px;*/
    margin: 1em 0;
    width:100%;
  }

  .post .fancy-button {
    background: #fff;
    color: #666;
    padding: 0.4em;
  }

  .post .button2 {
    background: darkgray;
    color: #666;
    padding: 0.1em;
  }

  .post .fancy-heading {
    font-family: Arial;
    font-size: 28px;
    color: white;
    margin-bottom: 10px;
    font-style: italic;
    /*font-style: oblique;*/
    overflow-wrap: break-word;
  }
}

</style>
