import userConf from './userConf'

const username = userConf.basic.username
const repo = userConf.basic.repo

const prefix = 'https://api.github.com'
const repos = `${prefix}/repos/${username}/${repo}`
const issues = `${repos}/issues`
const orgs = `${prefix}/orgs/${username}`
const users = `${prefix}/users`

export default {
  get: {
    singlePost: number => `${issues}/${number}`,
    posts: `${issues}?state=open`,
    comments: number => `${issues}/${number}/comments`,
    orgsMembers: `${orgs}/members`,
    userInfo: username => `${users}/${username}`,
    repoInfo: repos,
  }
}
