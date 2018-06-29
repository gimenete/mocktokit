const produce = require('immer').default
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http');

const routes = require('@octokit/rest/lib/routes.json')
const app = express()
app.use(bodyParser.json())

const initialState = {
  issues: []
}

module.exports = (port, webhook) => {
  let state = initialState
  let history = [state]

  const implementations = {}

  for (const section of Object.keys(routes)) {
    implementations[section] = require('./impl/' + section)({ webhook })

    const methods = routes[section]
    for (const method of Object.keys(methods)) {
      const info = methods[method]
      if (info.deprecated) continue
      const implementation = implementations[section][method]
      if (!implementation) continue // TODO

      app[info.method.toLowerCase()](info.url, async (req, res, next) => {
        try {
          const { params, body } = req

          let result = null
          state = produce(state, nextState => {
            result = implementation(nextState, { params, body })
          })
          history.push(state)
          res.json(result)
        } catch (err) {
          // TODO mimic GitHub response
          console.error(err.stack)
          res.status(500).json({ error: err.message })
        }
      })
    }
  }

  const httpServer = http.createServer(app)
  return new Promise((resolve, reject) => {
    httpServer.listen(port, (err) => {
      if (err) return reject(err)
      resolve({
        getState() {
          return state
        },
        close() {
          httpServer.close()
        },
        clean() {
          state = initialState
        }
        // TODO: history methods
        // TODO: setState() to reload a previous state?
      })
    })
  })
}

