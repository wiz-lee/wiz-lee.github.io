<template>
  <div id="app">
    <header>
      <div class="header-wrapper">
        <h1 class="blog-title"></> {{blogConf.name}}</h1>
        <nav>
          <div class="nav-item-wrapper">
            <router-link to="/">首页</router-link>
            <router-link to="/archive">归档</router-link>
            <router-link to="/">友链</router-link>
            <router-link to="/">关于</router-link>
          </div>
        </nav>
      </div>
    </header>
    <section class="page">
      <router-view/>
    </section>
    <footer>
    <p class="footer-content"><a href="https://github.com/Sevenskey/Nyaablog">Nyaablog</a> 强力驱动 ♥ {{basicConf.username}}</p>
    </footer>
  </div>
</template>

<script>
import conf from '@/service/conf'
export default {
  name: 'app',
  data: function () {
    return {
      blogConf: conf.blog,
      basicConf: conf.basic
    }
  },
  mounted: function () {
    document.title = this.blogConf.name
  }
}
</script>

<style lang="less">
@import "./style.less";
</style>
