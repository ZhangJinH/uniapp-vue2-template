const fs = require('fs')
const path = require('path')

function deleteall(path) {
  var files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(function (file, index) {
      var curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteall(curPath)
      } else {
        // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

class AutoCleanPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('auto-clean', stat => {
      const destPath = compiler.outputPath || stat.compiler.outputPath
      const ossFilePath = path.resolve(destPath, './static/oss')
      try {
        deleteall(ossFilePath)
        console.error('自动清理@/static/oss成功')
      } catch (e) {
        console.error('自动清理@/static/oss失败，请重试')
      }
    })
  }
}

module.exports = AutoCleanPlugin
