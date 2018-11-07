import post from './post'
import moment from 'moment'

const allPosts = post('all')

function getYearAndMonth (str) {
  const time = new Date(str)
  return {
    year: time.getFullYear(),
    month: time.getMonth() + 1
  }
}
export default allPosts.then(function (data) {
  const archiveData = {}
  data.forEach(e => {
    const t = getYearAndMonth(e.time)
    let y = archiveData[t.year]
    if (!y) {
      y = archiveData[t.year] = {}
    }
    let m = y[t.month]
    if (!m) {
      m = y[t.month] = []
    }
    m.push(e)
  })
  return archiveData
}).catch(function (err) {
  throw err
})
