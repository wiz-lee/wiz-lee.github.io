<template>
<div>
  <div class="loading" v-show="loading && ! haveNoContent">少女祈祷中...</div>

  <div class="have-no-content" v-if="haveNoContent">目前这里还啥都没有_(:з)∠)_</div>

  <article v-if="!loading" class="post">
    <h1 class="post-title">
      <router-link :to="{name: 'PostPage', params: {postId: latestPost.post_id}}">{{latestPost.title}}</router-link>
    </h1>
    <div class="post-time">{{latestPost.time}} <span v-if="showAuthor">{{latestPost.author ? latestPost.author.name : ''}}</span></div>
    <div v-html="postBody" class="post-body">
    </div>
  </article>
</div>
</template>

<script>
import post from '@/service/post'
import users from '@/service/users'
import marked from 'marked'

export default {
  name: 'Post',
  props: {
    postId: {
      type: [Number, String],
      default: 0,
    }
  },
  data () {
    return {
      loading: true,
      latestPost: null,
      postBody: '',
      showAuthor: false,
      haveNoContent: false
    }
  },
  mounted: function () {
    /* this.latestPost = this.loading */
    this.getLatestPost()
    this.updateAuthorStatus()
  },
  watch: {
    latestPost: function (newVal) {
      if (newVal) {
        this.loading = false
      }
    }
  },
  methods: {
    getLatestPost: function () {
      const postId = this.postId
      let postPromise
      if (postId) {
        postPromise = post('single', postId)
      } else {
        postPromise = post('latest')
      }
      postPromise.then(latestPost => {
        this.latestPost = latestPost
        if (!latestPost) {
          this.haveNoContent = true
          return 
        }
        if (latestPost.type === 'html') {
          this.postBody = latestPost.body
        } else {
          this.postBody = marked(latestPost.body)
        }
      })
    },
    updateAuthorStatus: function () {
      users.then(users => {
        if (users.length > 1) {
          this.showAuthor = true
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
