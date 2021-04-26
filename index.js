const _ = require('lodash')
const { DefinePlugin, WebpackError } = require('webpack')
const pkgUp = require('pkg-up')
const { ConcatSource } = require('webpack-sources')

const git = require('./utilities/git')

const pluginName = 'EnvInfoPlugin'

const globalThisName = {
  web: 'window',
  node: 'global',
}

/**
 * Resolve version from closest package.json file.
 * @param {String} cwd Directory to start from.
 */
const getPkgInfo = (cwd) => {
  return pkgUp(cwd).then((filepath) => {
    if (!filepath) {
      throw new Error(
        `Cannot resolve package info from package.json: No such file.`
      )
    }

    try {
      // eslint-disable-next-line
      const pkg = require(filepath)

      return pkg
    } catch (err) {
      throw new Error(
        `Cannot resolve package info from ${filepath}: ${err.message}`
      )
    }
  })
}

/**
 * Get last updated commit hash from git history.
 * @param {String} cwd Directory to resolve from.
 */
const getHash = (cwd) => {
  return git
    .isGitRepo(cwd)
    .then((result) => {
      if (!result) {
        return ''
      }

      return git.getLastUpdatedCommitHash(cwd)
    })
    .catch((err) => {
      return Promise.reject(
        new Error(`Cannot resolve git hash from ${cwd}: ${err.message}`)
      )
    })
}

const report = (type, err, compiler) => {
  compiler.hooks.compilation.tap(pluginName, (compilation) => {
    const error = new WebpackError(`${pluginName} - ${err.message}`)

    error.name = 'EnvResolveError'
    compilation[`${type}s`].push(error)
  })
}

const reportError = (err, compiler) => {
  report('error', err, compiler)
}

const reportWarning = (err, compiler) => {
  report('warning', err, compiler)
}

class EnvInfoWebpackPlugin {
  /**
   * Resolve user options.
   * @param {Object} options Options from user.
   * @param {String} options.name Variable name for env info.
   * @param {Boolean} options.output Output env info to global variable.
   * @param {Boolean|String} options.persistent Persistent storage to local file.
   * @return {void}
   */
  constructor(options) {
    this.options = _.defaults(options, {
      name: 'BUILD_INFO',
      output: false,
      persistent: false,
    })
  }

  /**
   * Apply the plugin.
   * @param {Compiler} compiler Webpack compiler.
   * @returns {void}
   */
  apply(compiler) {
    const { RawSource } = compiler.webpack.sources

    let envInfo = null

    compiler.hooks.beforeCompile.tapPromise(pluginName, async () => {
      let pkgInfo = {}
      let hash = ''

      try {
        ;[pkgInfo, hash] = await Promise.all([
          getPkgInfo(compiler.context).catch((err) =>
            reportError(err, compiler)
          ),
          getHash(compiler.context).catch((err) =>
            reportWarning(err, compiler)
          ),
        ])
      } catch (err) {
        reportError(err, compiler)
      }

      envInfo = {
        name: pkgInfo.name || '',
        version: pkgInfo.version || '',
        time: new Date().toISOString(),
        hash,
      }

      const env = {
        [this.options.name]: JSON.stringify(envInfo),
      }

      new DefinePlugin(env).apply(compiler)
    })

    if (this.options.persistent) {
      compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
        const filename = _.isString(this.options.persistent)
          ? this.options.persistent
          : 'env-info.json'
        const content = JSON.stringify(envInfo, null, 2)

        compilation.hooks.processAssets.tap(pluginName, () => {
          compilation.emitAsset(filename, new RawSource(content))
        })
      })
    }

    const { target } = compiler.options

    if (this.options.output) {
      if (!globalThisName[target]) {
        reportWarning(
          new Error(
            'Sorry, output option does not support the current target. But PRs are welcome.'
          ),
          compiler
        )
        return
      }

      compiler.hooks.compilation.tap(pluginName, (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: pluginName,
            stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
          },
          () => {
            const output = _.isString(this.options.output)
              ? this.options.output
              : this.options.name
            const content = `;${
              globalThisName[target]
            }.${output} = ${JSON.stringify(envInfo)};`

            compilation.chunks.forEach((chunk) => {
              if (!chunk.canBeInitial()) {
                return
              }

              chunk.files.forEach((file) => {
                compilation.updateAsset(
                  file,
                  (old) => new ConcatSource(content, '\n', old)
                )
              })
            })
          }
        )
      })
    }
  }
}

module.exports = EnvInfoWebpackPlugin
