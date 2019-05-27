const childProcess = require('child_process')

exports.isGitRepo = function isGitRepo(cwd) {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      'git rev-parse --is-inside-work-tree',
      {
        cwd,
      },
      (err, stdout, stderr) => {
        if (err) {
          reject(err)
          return
        }

        if (stderr) {
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
      (err, stdout, stderr) => {
        if (err) {
          reject(err)
          return
        }

        if (stderr) {
          reject(err)
          return
        }

        resolve(stdout.replace(/\s+$/, ''))
      }
    )
  })
}
