import axios from 'axios'
import API from './public/api'
import {comments} from './comments'
import users from './users'
import userConf from './public/userConf'
import oldPostsList from './data/oldPostsList'

const includeOld = userConf.blog.compatible
const ignoredTags = userConf.blog.ignoredTags
const oldPostPrefix = 'old-'


function getAllOldPosts () {
  return axios.get(oldPostsList)
    .then(function(res) {
      return res.data
    })
}

/*
 * @post_id Number
 */
if (includeOld) {
  var getSingleOldPost = _getSingleOldPost()
}
function _getSingleOldPost () {
  let allOldPosts
  return function(post_id) {
    if (allOldPosts) {
      return Promise.resolve(allOldPosts[post_id])
    } else {
      return getAllOldPosts()
        .then(function(data) {
          allOldPosts = data.reverse()
          return allOldPosts[post_id]
        })
        .catch(function(err) {
          throw err
        })
    }
  }
}

/*
 * @postNumber Number
 * @return Promise
 */
function getSinglePost (postNumber) {
  if (postNumber.toString().indexOf(oldPostPrefix) !== -1) {
    return getSingleOldPost(postNumber.slice(4))
  }
  let normalPostData
  postNumber = parseInt(postNumber, 10)
  if (postNumber === 0) {
    return getLatestPosts()
  }
  return axios.get(API.get.singlePost(postNumber))
    .then(function (postRes) {
      normalPostData = formatRawPostData(postRes.data)
      return comments(postRes.data.number)
    })
    .then(function (normalCommentsData) {
      // console.log(normalCommentsData)
      return genNormalPostData(normalPostData, normalCommentsData)
    })
    .catch(function (error) {
      throw error
    })
}

/*
 * @return Promise
 */
function getLatestPosts () {
  return getAllPosts().then(function (posts) {
    return posts[0]
  })
}

/*
 * @param Object
 * @return Function
 */
function getSomePosts ({numEachPage = null, sortedBy = 'number', order = 'desc'}) {
  let somePosts = getAllPosts().then(function (postsList) {
    numEachPage = parseInt(numEachPage, 10)
    if (!numEachPage) {
      numEachPage = postsList.length
    }
    let postsArr = []
    for (let i = 1; i < postsList.length; i *= 2) {
      postsArr.push(postsList.slice(0, i))
      if (i * 2 >= postsList.length) {
        postsArr.push(postsList.slice(i))
      }
    }
    return postsArr
  })
  /*
   * @currentPage Number
   * @return Promise
   */
  return function (currentPage) {
    currentPage -= 1
    return somePosts.then(function (postsArr) {
      return postsArr[currentPage]
    })
  }
}

/*
 * @return Promise
 */
function getAllPosts () {
  let postsList = axios.get(API.get.posts)
    .then(function (res) {
      return res.data.map(post => {
        return formatRawPostData(post)
      })
    })
  let oldPostsList = {}
  if (includeOld) {
    oldPostsList = getAllOldPosts()
  }

  return Promise.all([users, postsList, Promise.resolve(oldPostsList)])
    .then(function (data) {
      return getValidPosts(data[0], data[1])
        .concat(Array.isArray(data[2]) ? data[2] : [])
    })
}

/*
 * @usersList Array, @postsList Array
 * @return Array
 */
function getValidPosts (usersList, postsList) {
  let newPostsList = []
  postsList.forEach(post => {
    for (let i = 0; i < usersList.length; i++) {
      if (post.author.name.toLowerCase() === usersList[i].toLowerCase()) {
        newPostsList.push(post)
        break
      }
    }
  })
  return filterIgnoredTags(newPostsList)
}

function filterIgnoredTags (postsList) {
  if (ignoredTags.length === 0) {
    return postsList
  }
  let newPostsList = []
  postsList.forEach(post => {
    for (let i = 0; i < ignoredTags.length; i++) {
      if (post.tags.join(',').indexOf(ignoredTags[i]) === -1) {
        newPostsList.push(post)
        break
      }
    }
  })
  return newPostsList
}

/*
 * @postData Object; @normalCommentDatas Object
 * @return Object
 */
function genNormalPostData (pd, cds) {
  pd.comments = cds
  return pd
}

/*
 * @rawData Object
 * @return Object
 */
function formatRawPostData (rd) {
  const nd = {}
  nd.author = {
    name: rd.user.login,
    avatar_url: rd.user.avatar_url,
    github: rd.user.html_url
  }
  nd.post_id = rd.number
  nd.title = rd.title
  nd.time = formatTimeString(rd.created_at)
  nd.body = rd.body
  nd.tags = rd.labels
  return nd
}

function formatTimeString (timeString) {
  return timeString.replace('T', ' ').replace('Z', '')
}

export default function post (mode, param) {
  switch (mode) {
    case 'single':
      return getSinglePost(param)
    case 'latest':
      return getLatestPosts()
    case 'some':
      return getSomePosts(param)
    case 'all':
      return getAllPosts()
    default:
      throw new Error(`没有 ${mode} 模式哟`)
  }
}
