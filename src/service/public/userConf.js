import userConf from '@/config/user.js'

const username = userConf.basic.username
if (!username) {
  throw new Error('Not defined username')
}

const repo = userConf.basic.repo
const name = userConf.blog.name
const template = userConf.blog.template
const compatible = userConf.blog.compatible
const comments = userConf.blog.comments
const ignoredTags = userConf.blog.ignoredTags

userConf.basic.repo = repo || (username + '.github.io')
userConf.blog.name = name || username
userConf.blog.template = template || 'default'
userConf.blog.compatible = compatible || false
userConf.blog.comments = (comments === false) ? comments : true
userConf.blog.ignoredTags = typeof ignoredTags === 'string' ? ignoredTags.split(';') : ignoredTags

export default userConf
