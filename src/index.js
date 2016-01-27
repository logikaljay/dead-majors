const { parseRawCommit } = require('conventional-changelog/lib/git')
var log = require('npmlog')

module.exports = function (pluginConfig, {commits}, cb) {
  let type = null
  log.verbose('init', 'dead-majors preventing major version bump')
  commits

  .map((commit) => parseRawCommit(`${commit.hash}\n${commit.message}`))

  .filter((commit) => !!commit)

  .every((commit) => {
    if (commit.breaks.length) {
      // type = 'major'
      type = 'minor'
      return false
    }

    if (commit.type === 'feat') type = 'minor'

    if (!type && commit.type === 'fix') type = 'patch'

    return true
  })

  cb(null, type)
}
