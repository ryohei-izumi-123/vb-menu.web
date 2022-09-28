'use strict'
const green = '\u001b[32m'
const red = '\u001b[31m'
const black = '\u001b[0m'
const replace = require('replace-in-files')
const _ = require('lodash')
const version = require('./package.json').version
const options = {
  optionsForFiles: {
    ignore: ['**/node_modules/**'],
  },
  allowEmptyPaths: false,
  saveOldFile: false,
  encoding: 'utf8',
  onlyFindPathsWithoutReplace: false,
  returnPaths: true,
  returnCountOfMatchesByPaths: true,
}
const opt = _.assign(_.cloneDeep(options), {
  files: [
    'src/sw.js',
    'src/js/app.js',
  ],
  from: new RegExp(/VERSION \= '(.*)'/, 'gi'),
  to: `VERSION = '${version}'`,
})
const resolve = (results) =>
  results.map((result) =>
    result
      ? console.log(
          `${green} Build version ${version}, Modified files ${JSON.stringify(
            result.countOfMatchesByPaths
          )} ${black}`,
          result
        )
      : undefined
  )
const reject = (errors) =>
  errors.map((error) =>
    error
      ? console.error(
          `${red} Error occurred, reason ${error.message} ${black}`,
          error
        )
      : undefined
  )

Promise.all([replace(opt)])
  .then(resolve)
  .catch(reject)
  .finally(() => process.exit(0))
