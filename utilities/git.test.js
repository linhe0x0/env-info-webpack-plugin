const os = require('os')
const git = require('./git')

describe('check git repo', () => {
  test('Working in git repo', async () => {
    const result = await git.isGitRepo(__dirname)

    expect(result).toBe(true)
  })

  test('not working in git repo', async () => {
    const dir = os.tmpdir()
    const result = await git.isGitRepo(dir)

    expect(result).toBe(false)
  })
})

describe('get last updated commit hash', () => {
  test('get last updated commit hash in git repo', async () => {
    const hash = await git.getLastUpdatedCommitHash(__dirname)

    expect(typeof hash).toBe('string')
    expect(hash).toHaveLength(40)
  })

  test('get last updated commit hash in non git repo', async () => {
    const dir = os.tmpdir()

    await expect(git.getLastUpdatedCommitHash(dir)).rejects.toThrow()
  })
})
