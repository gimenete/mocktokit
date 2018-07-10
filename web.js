import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import ReactJson from 'react-json-view'

import { NavLink, Switch, Route } from 'react-router-dom'
// import * as babel from '@babel/standalone'
// import typescript from '@babel/preset-typescript'
import client from './client'
import initEditor from './monaco'
import './styles.css'

const github = client()

const Navigation = () => {
  return (
    <nav className="UnderlineNav" style={{ marginBottom: 30 }}>
      <div className="UnderlineNav-body">
        <NavLink to="/users" className="UnderlineNav-item" activeClassName="selected">
          Users
        </NavLink>
        <NavLink to="/organizations" className="UnderlineNav-item" activeClassName="selected">
          Organizations
        </NavLink>
        <NavLink to="/apps" className="UnderlineNav-item" activeClassName="selected">
          Apps
        </NavLink>
        <NavLink to="/repositories" className="UnderlineNav-item" activeClassName="selected">
          Repositories
        </NavLink>
        <NavLink to="/projects" className="UnderlineNav-item" activeClassName="selected">
          Projects
        </NavLink>
        <NavLink to="/issues" className="UnderlineNav-item" activeClassName="selected">
          Issues
        </NavLink>
      </div>
    </nav>
  )
}

const Home = () => {
  return <div>Home</div>
}

const Users = () => {
  const users = [
    {
      login: 'foo'
    },
    {
      login: 'bar'
    },
    {
      login: 'baz'
    }
  ]
  return (
    <div>
      <div className="Box">
        <ul>
          {users.map(user => (
            <li key={user.login} className="Box-row">
              {user.login}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const Organizations = () => {
  return <div>Organizations</div>
}

const Apps = () => {
  return <div>Apps</div>
}

const Repositories = () => {
  return <div>Repositories</div>
}

const Projects = () => {
  return <div>Projects</div>
}

const Issues = () => {
  const sortBySpan = {
    paddingLeft: 20
  }
  return (
    <div>
      <div className="clearfix">
        <div className="col-sm-10 float-left text-center">
          <div className="input-group">
            <span className="input-group-button">
              <button className="btn" type="button" aria-label="Copy to clipboard">
                <span>Filters ↓</span>
              </button>
            </span>
            <input
              type="text"
              className="form-control"
              aria-label="Username"
              defaultValue="is:issue is:open sort:updated-desc"
              placeholder="Search all issues"
            />
          </div>
        </div>
        <div className="col-sm-2 float-left text-right">
          <div className="text-right">
            <button className="btn btn-primary">New issue</button>
          </div>
        </div>
        <br />
      </div>
      <br />
      <div className="Box">
        <div className="Box-header text-right">
          <span style={sortBySpan}>Author ↓</span>
          <span style={sortBySpan}>Labels ↓</span>
          <span style={sortBySpan}>Projects ↓</span>
          <span style={sortBySpan}>Milestones ↓</span>
          <span style={sortBySpan}>Assignee ↓</span>
          <span style={sortBySpan}>Sort ↓</span>
        </div>
        <ul>
          {github.getState().issues.map(issue => (
            <li key={issue.number} className="Box-row">
              <div className="container-lg clearfix">
                <div className="col-sm-1 float-left text-center">
                  <span title="Status: open" className="State State--green State--small">
                    Open
                  </span>
                </div>
                <div className="col-sm-9 float-left">
                  <p>
                    <strong>{issue.title}</strong>
                  </p>
                  <p style={{ color: '#aaa' }}>
                    #{issue.number} opened xxx by {issue.author}
                  </p>
                  <p>
                    {issue.labels.map(label => (
                      <span
                        key={label.name}
                        title={`Label: ${label.name}`}
                        className={`Label ${label.color}`}
                      >
                        {label.name}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="col-sm-2 float-left text-right">
                  <img
                    className="avatar"
                    alt="Uncle Cat"
                    width="36"
                    height="36"
                    src="https://user-images.githubusercontent.com/334891/29999089-2837c968-9009-11e7-92c1-6a7540a594d5.png"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

class DevTools extends Component {
  render() {}
}

class Repl extends Component {
  initEditor = elem => {
    if (elem && !this.editor) this.editor = initEditor(elem)
  }
  cleanAndRunCode = () => {
    github.cleanState()
    this.runCode()
  }
  runCode = () => {
    const code = this.editor.getValue()
    // TODO
    // const code = babel.transform(this.editor.getValue(), {
    //   plugins: [typescript]
    // })
    const func = new Function(
      'module',
      'github',
      'window',
      'document',
      'navigator',
      code + ';\n return module.exports()'
    )
    const module = { exports: {} }
    Promise.resolve(func(module, github.api))
      .then(() => {
        console.log('run successful!')
      })
      .catch(err => {
        console.error('REPL error', err)
      })
  }
  render() {
    const editorStyle = {
      width: '100%',
      height: 400,
      border: '1px solid #ccc'
    }
    return (
      <div>
        <div className="mt-2" style={editorStyle} ref={this.initEditor} />
        <p className="mt-1 pl-2 pr-2">
          <span className="text-right float-right" style={{ color: '#aaa' }}>
            Octokit REPL<br />Type <code>github.</code> and it will start autocompleting
          </span>
          <button className="btn btn-primary" onClick={this.runCode}>
            Run
          </button>{' '}
          <button className="btn" onClick={this.cleanAndRunCode}>
            Clean state &amp; Run
          </button>
        </p>
      </div>
    )
  }
}

class App extends Component {
  state = {
    devToolsOpen: false
  }
  componentDidMount() {
    github.on('state-changed', () => this.forceUpdate())
  }
  toggleDevTools = () => {
    this.setState(state => ({ devToolsOpen: !state.devToolsOpen }))
  }
  render() {
    return (
      <HashRouter>
        <Fragment>
          <div className={`mk-main ${this.state.devToolsOpen ? 'open' : ''}`}>
            <h1>Mocktokit</h1>
            <Navigation />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/users" component={Users} />
              <Route path="/organizations" component={Organizations} />
              <Route path="/apps" component={Apps} />
              <Route path="/repositories" component={Repositories} />
              <Route path="/projects" component={Projects} />
              <Route path="/issues" component={Issues} />
            </Switch>
          </div>
          <div
            className="clearfix pl-4 pr-4 pt-2 pb-2"
            className={`mk-dev-tools ${this.state.devToolsOpen ? 'open' : ''}`}
          >
            <div className="clearfix text-center">
              <button
                className="btn mt-2 pl-4 pr-4"
                style={{ textAlign: 'center' }}
                onClick={this.toggleDevTools}
              >
                ↕︎
              </button>
            </div>
            <div className="col-sm-6 float-left pr-2 ">
              <Repl />
            </div>
            <div className="col-sm-6 float-left pr-2">
              <nav className="menu mt-2" aria-labelledby="menu-heading">
                <span className="menu-heading" id="menu-heading">
                  Events
                </span>
                {github.getState().events.map(event => (
                  <div className="menu-item" aria-current="page" key={event.id}>
                    <div className="float-right" style={{ display: 'none' }}>
                      <div>
                        <span className="Label Label--outline">...</span>
                      </div>
                      <div className="Popover right-0 left-0">
                        <div className="Popover-message Popover-message--top-right text-left p-4 mt-2 Box box-shadow-large">
                          <p>
                            Event triggered from the UI <code>3 min ago</code>
                          </p>
                          <button
                            type="submit"
                            className="btn btn-outline mt-2 text-bold"
                            style={{ width: '100%' }}
                          >
                            Restore this state
                          </button>
                          <button
                            type="submit"
                            className="btn btn-outline mt-2 text-bold"
                            style={{ width: '100%' }}
                          >
                            Copy test to clipboard
                          </button>
                        </div>
                      </div>
                    </div>
                    Issue opened
                    <ReactJson
                      name={event.id}
                      indentWidth={2}
                      src={event.event}
                      collapsed={1}
                      enableClipboard={false}
                    />
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </Fragment>
      </HashRouter>
    )
  }
}

var mountNode = document.getElementById('app')
ReactDOM.render(<App />, mountNode)
