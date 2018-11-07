import axios from 'axios'
import userConf from './public/userConf'
import API from './public/api'
import valid from './validVeri'

let users = userConf.basic.users
let username = userConf.basic.username

function resolveUsersList (users) {
  if (!users || typeof users === 'string') {
    return axios.get(API.get.userInfo(users || username))
      .then(function (res) {
        if (res.status === 404) {
          throw new Error(`该 Github 账号（${users}）不存在`)
        }
        return getUsersList(res.data, users)
      })
      .catch(function (error) {
        throw error
      })
  } else if (Array.isArray(users)) {
    return thenlize(users)
  } else {
    throw new Error(`basic.users字段不合法`)
  }
}

function thenlize (value) {
  return {
    then: function (resolve, reject) {
      resolve(value)
    }
  }
}

function getUsersList (data, users) {
  if (data.type === 'Organization') {
    return axios.get(API.get.orgsMembers)
      .then(function (res) {
        return res.data.map(userInfo => {
          return userInfo.login
        })
      })
  } else if (data.type === 'User') {
    return Promise.resolve(thenlize([users]))
  } else {
    throw new Error(`预料外的类型 ${data.type}`)
  }
}

export default valid.then(function () {
  return resolveUsersList(users)
})
.catch(function (error) {
  throw error
})
