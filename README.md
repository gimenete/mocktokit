# Mocktokit

A Mock GitHub API for testing integrations.

*This project is just an idea*. Barely anything is implemented.

## The idea

```js
// Start the server
const port = 5000
const server = await mocktokit(port, webhook)

// Create an octokit client with a custom baseUrl
const octokit = require('@octokit/rest')({
  baseUrl: 'http://localhost:5000'
})

// Now you can start making API requests to the mock server
// Just by using octokit

// At any moment you can get an immutable snapshot of the state
const state1 = server.getState()

// Modify something by using regular octokit methods
await octokit.issues.create({
  owner: 'gimenete',
  repo: 'test-repo',
  title: 'One issue'
})
// Take another snapshot
const state2 = server.getState()

// You can assert any snapshot
console.log('state1', state1)
console.log('state2', state2)
```

See the `example.js` file for a _full_ example.

## Benefits

- No need to create fixtures. Just use the regular `@octokit/rest` methods to create an in-memory mock server
- Take a snapshot at any moment. For example in your `before()` hook of your test suite to run multiple tests with the same environment.
- The snapshot is serializable so you can test the whole state using Jest snapshot support or a similar tool.

## Ideas

Implement a web UI similar to github.com using [Primer](https://primer.github.io/) so a user can easily:

- Inspect the state visually
- Modify things (e.g. an issue) to trigger webhook events
- Inspect a log of webhook events

This also would lower the barrier to create [probot](https://github.com/probot/probot) applications. Initially you won't have to create a GitHub app, nor any webhook integration. You would be able to start writing your application and see a UI similar to github.com seeing the results of your code and the ability to interact with it and thus, triggering events to the probot application.
