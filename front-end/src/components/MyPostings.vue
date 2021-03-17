<template>
  <div class="main">
    <h2>Logged in as: {{user.firstName}} {{user.lastName}} <button @click="logout" class="pure-button pure-button-primary">Logout</button></h2>
    <h1>Add Post:</h1>
    <form class="pure-form" @submit.prevent="addPosting">

      <legend>{{interval}}</legend>
      <fieldset>
        <textarea v-model="post"></textarea>
        <br />
        <button class="pure-button pure-button-primary" type="submit">Post</button>
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
      creating: true,
      post: '',
      postings: [],
      showEditField: false,
      likeCount: 0,
      dislikeCount: 0,

      interval: "loading...",

    }
  },
  computed: {

    user() {
      return this.$root.$data.user;
    }
  },
  created() {
    this.getPostings();
    this.getCurrentTime(); //Don't wait 1 second, update time immediately
    //Update time every second
    setInterval(() => {
      this.getCurrentTime();
    }, 1000)
  },


  methods: {
    getCurrentTime() {
      this.interval = new Date().toLocaleString()
    },
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
        this.getPostings();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    time(d) {
      return moment(d).format('D MMMM YYYY, h:mm:ss a');
    },
    async addPosting() {
      try {
        await axios.post("/api/postings", {
          post: this.post,
          likeCount: this.likeCount,
          dislikeCount: this.dislikeCount,
          created: new Date().toLocaleString()
        });
        this.post = "";
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

/*.post:hover {*/
/*  !*transform: scale(1.2) rotateZ(90deg);*!*/
/*  box-shadow: none;*/
/*  !*margin-left: 100px;*!*/

/*  !*width: 500px;*!*/
/*  !*height: 500px;*!*/
/*  !*background: red;*!*/
/*  !*transition: width 2s;*!*/
/*  !*transform: rotateZ(90deg);*!*/
/*  !*width: 500px;*!*/
/*  !*height: 500px;*!*/
/*  transition: width 2s, height 2s, transform 2s;*/
/*  transform: rotate(30deg);*/
/*}*/

/*.post {*/
/*  transition: width 0.4s, height 0.4s, transform 0.4s;*/
/*}*/


/* Fade in code from: https://stackoverflow.com/questions/11679567/using-css-for-a-fade-in-effect-on-page-load */
@keyframes fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* Firefox < 16 */
@-moz-keyframes fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* Safari, Chrome and Opera > 12.1 */
@-webkit-keyframes fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* Internet Explorer */
@-ms-keyframes fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* Opera < 12.1 */
@-o-keyframes fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}
* {
  margin-top: 25px;
  font-size: 21px;
  text-align: center;

  -webkit-animation: fadein 2s; /* Safari, Chrome and Opera > 12.1 */
  -moz-animation: fadein 2s; /* Firefox < 16 */
  -ms-animation: fadein 2s; /* Internet Explorer */
  -o-animation: fadein 2s; /* Opera < 12.1 */
  animation: fadein 2s;
}

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
    width: 60%;
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



