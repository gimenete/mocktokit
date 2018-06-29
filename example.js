const mocktokit = require('.')

const webhook = 'http://...'

const run = async () => {
  // Start the server
  const port = 5000
  const server = await mocktokit(port, webhook)

  // Create an octokit client with a custom baseUrl
  const octokit = require('@octokit/rest')({
    baseUrl: 'http://localhost:5000'
  })

  // At any moment you can get an immutable snapshot of the state
  const state1 = server.getState()
  await octokit.issues.create({
    owner: 'gimenete',
    repo: 'test-repo',
    title: 'One issue'
  })
  const state2 = server.getState()
  await octokit.issues.create({
    owner: 'gimenete',
    repo: 'test-repo',
    title: 'Another issue'
  })
  const state3 = server.getState()

  console.log('state1', state1)
  console.log('state2', state2)
  console.log('state3', state3)

  await server.close()
}

run().catch(err => {
  console.error(err.stack)
  process.exit(1)
})
