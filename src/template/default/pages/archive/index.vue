<template>
<div>
<ul class="archive">
  <li v-for="year in orderedData">
    <h1 class="archive-year-title">{{year.title}}</h1>
    <ul class="archive-month">
      <li v-for="month in year.content">
        <h2 class="archive-month-title">{{month.title}}月（{{month.content.length}}）</h2>
        <ul class="archive-posts">
          <li class="archive-post-link" v-for="post in month.content">
            <router-link :to="{name: 'PostPage', params: {postId: post.post_id}}">{{post.title}}</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
</div>
</template>

<script>
import archivePromise from '@/service/archive'

export default {
  name: 'archive',
  data () {
    return {
      orderedData: [],
      archiveData: {}
    }
  },
  mounted: function () {
    archivePromise.then((archiveData) => {
      this.archiveData = archiveData
      this.orderedData = this.orderData(archiveData)
      console.log(this.orderedData)
    })
  },
  watch: {
  },
  methods: {
    orderData: function (rawData) {
      const orderedData = []
      Object.keys(rawData)
        .sort((a, b) => { return b - a })
        .forEach((e, i) => {
          const item = {}
          orderedData[i] = item
          item.title = e
          item.content = Array.isArray(rawData[e]) ? rawData[e] : this.orderData(rawData[e]) })
      return orderedData
    }
  }
}
</script>
