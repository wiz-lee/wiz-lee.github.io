import axios from 'axios'
import API from './public/api'

export function comments (postNum) {
  postNum = parseInt(postNum, 10)
  if (!isNaN(postNum)) {
    return axios.get(API.get.comments(postNum))
      .then(function (res) {
        return formatRawCommentsData(res.data)
      })
      .catch(function (error) {
        throw error
      })
  } else {
    throw new Error('post 编号不合法')
  }
}

/*
 * @rawData Array
 * @return Array
 */
function formatRawCommentsData (rds) {
  // normalData
  const nds = []
  rds.forEach(function (rd) {
    let nd = {}
    nd.author = {
      name: rd.user.login,
      avatar_url: rd.user.avatar_url,
      github: rd.user.html_url
    }
    nd.time = rd.created_at
    nd.body = rd.body
    nds.push(nd)
  })
  return nds
}
