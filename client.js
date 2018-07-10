const produce = require('immer').default
const routes = require('@octokit/rest/lib/routes.json')
const EventEmitter = require('eventemitter3')
const uuidv4 = require('uuid/v4')

const initialState = {
  issues: [],
  events: []
}

class Client extends EventEmitter {
  constructor() {
    super()
    this.state = initialState
    this.history = [this.state]
    this.api = {}

    const implementations = {}
    for (const section of Object.keys(routes)) {
      implementations[section] = require('./impl/' + section)()
      this.api[section] = {}
      const methods = routes[section]
      for (const method of Object.keys(methods)) {
        const info = methods[method]
        if (info.deprecated) continue
        const implementation = implementations[section][method]
        if (!implementation) {
          this.api[section][method] = async () => {
            console.log(`${section}.${method} not implemented`)
          }
          continue // TODO
        }
        this.api[section][method] = async params => {
          // TODO: validate https://github.com/octokit/rest.js/blob/master/lib/plugins/endpoint-methods/validate.js
          console.log({ info })

          let result = null
          this.state = produce(this.state, nextState => {
            const emitWebhook = event => nextState.events.push({ id: uuidv4(), event })
            result = implementation(nextState, params, emitWebhook)
          })
          this.history.push(this.state)
          this.emit('state-changed')
          return result
        }
      }
    }
  }

  getState() {
    return this.state
  }

  setState(state) {
    this.state = { ...state, initialState }
  }

  cleanState() {
    this.state = initialState
  }
}

module.exports = () => new Client()
