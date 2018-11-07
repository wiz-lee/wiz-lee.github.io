import Vue from 'vue'
import Router from 'vue-router'

import Index from '../pages/index'
import PostPage from '../pages/post'
import Archive from '../pages/archive'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/post/:postId',
      name: 'PostPage',
      component: PostPage
    },
    {
      path: '/archive',
      name: 'Archive',
      component: Archive
    }
  ],
  RouteConfig: {
    linkActiveClass: 'nav-active'
  }
})
