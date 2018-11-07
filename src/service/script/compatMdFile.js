const fs = require('fs')
const path = require('path')
const moment = require('moment')

const defalutOldPostsDir = path.normalize(__dirname + '\\..\\..\\public\\old_posts')
const oldPostsDir = process.argv[process.argv.length - 1]
const wroteFile = path.normalize(__dirname + '\\..\\data\\oldPostsList')

const oldPostsData = []

let files

try {
  files = fs.readdirSync(oldPostsDir)
} catch (e) {
  try {
    files = fs.readdirSync(defalutOldPostsDir)
  } catch (e) {
    throw new Error('Can\'t find this dir.')
  }
}
try {
  genPostsData(files)
} catch (e) {
  throw e
}

function genPostsData(files) {
  const filesList = processFilesList(files)
  const promiseList = []
  filesList.forEach(function (fileName, index) {
    promiseList.push(processFile(fileName, index))
  })
  Promise.all(promiseList)
    .then(function(data) {
      // dec
      writePostsDataFile(JSON.stringify(data.reverse()))
    })
    .catch(function(err) {
      throw err
    })
}

// asc
function processFilesList(files) {
  files.sort(function(fileName1, fileName2) {
    return fileNameToNumber(fileName1) - fileNameToNumber(fileName2)
  })
  return files
}

function processFile(fileName, index) {
  const postDetail = {}
  const parsedName = path.parse(fileName)
  postDetail.title = postDetail.time = moment(parsedName.name, 'YYYYMMDD').format('YYYY-MM-DD')
  postDetail.type = parsedName.ext.slice(1)
  postDetail.tags = []
  postDetail.post_id = 'old-' + index

  return new Promise(function(resolve, reject) {
    fs.readFile(defalutOldPostsDir + path.sep + fileName, 'utf8', function(err, data) {
      if (err) reject(err)
      postDetail.body = data
      resolve(postDetail)
    })
  })
}

function writePostsDataFile(postsData) {
  fs.writeFile(wroteFile, postsData, function(err) {
    if (err) throw err
    console.log('Updating list of old posts successfully.')
  })
}

function fileNameToNumber(fileName) {
  return parseInt(fileName)
}
