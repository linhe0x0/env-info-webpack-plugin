const childProcess = require('child_process')

exports.isGitRepo = function isGitRepo(cwd) {
  return new Promise((resolve) => {
    childProcess.exec(
      'git rev-parse --is-inside-work-tree',
      {
        cwd,
      },
      (err, stdout) => {
        if (err) {
          resolve(false)
          return
        }

        resolve(stdout.replace(/\s+$/, '') === 'true')
      }
    )
  })
}

exports.getLastUpdatedCommitHash = function getLastUpdatedCommitHash(cwd) {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      'git log -1 --format=%H',
      {
        cwd,
      },
      (err, stdout) => {
        if (err) {
          reject(err)
          return
        }

        resolve(stdout.replace(/\s+$/, ''))
      }
    )
  })
}
