const fs = require('fs')
const {exec} = require('child_process')
const path = require('path')

const scriptPath = __dirname
const scriptList = []
const mainName = path.basename(__filename)

fs.readdir(scriptPath, function(err, files) {
  if (err) throw err
  files.forEach(function(e) {
    const filterReg = RegExp('\\.js$', 'g')
    if ((e !== mainName) && filterReg.test(e)) {
      scriptList.push(e)
    }
  })

  execScripts(scriptList)
})

function execScripts (scriptList) {
  scriptList.forEach(function(script) {
    const fullPath = path.format({
      dir: scriptPath,
      base: script
    })
    exec('node ' + fullPath, function (err, stdout, stderr) {
      if (err) throw err
      console.log(stdout)
    })
  })
}
