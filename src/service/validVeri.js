import axios from 'axios'
import userConf from './public/userConf'
import API from './public/api'

/* 用户&repo合法性验证 */
let username = userConf.basic.username
let repo = userConf.basic.repo

export default axios.get(API.get.userInfo(username))
  .then(function (res) {
    return axios.get(API.get.repoInfo)
  })
  .then(function (res) {
  })
  .catch(function (error) {
    throw new Error(`Github 账号 ${username} 或项目 ${repo} 不存在 `)
  })
