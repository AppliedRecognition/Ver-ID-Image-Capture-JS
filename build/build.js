const fs = require("fs")
const minify = require("minify")
const util = require("util")
const path = require("path")
const tmp = require("tmp")

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const readDir = util.promisify(fs.readdir)
const tempFile = util.promisify(tmp.file)

const srcDir = fs.realpathSync(__dirname+"/../src")
const destDir = fs.realpathSync(__dirname+"/../dist")

readDir(srcDir).then(files => {
    files = files.filter(file => {
        return file.endsWith(".js")
    })
    var promises = files.map(file => {
        return readFile(path.join(srcDir, file)).then(javascript => {
            return tempFile({"postfix":".js"}).then(tmpFilePath => {
                return writeFile(tmpFilePath, javascript).then(() => {
                    return minify(tmpFilePath)
                }).finally(() => {
                    fs.unlinkSync(tmpFilePath)
                })
            })
        }).then(minified => {
            var built = file.substr(0, file.lastIndexOf("."))+".min.js"
            return writeFile(path.join(destDir, built), minified).then(() => {
                console.log("Wrote "+built)
            })
        })
    })
    return Promise.all(promises)
}).catch(error => {
    console.error(error)
})