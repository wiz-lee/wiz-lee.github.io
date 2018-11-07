<template>
<div>
  <post :post-id="$route.params.postId"></post>
</div>
</template>

<script>
import Post from '../../public/post'

export default {
  name: 'Index',
  data () {
    return {
    }
  },
  mounted: function () {
  },
  watch: {
  },
  methods: {
  },
  components: {
    post: Post
  }
}
</script>

<style scoped>
</style>

