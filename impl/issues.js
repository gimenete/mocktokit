const produce = require('immer').default

module.exports = () => {
  let nextIssueNumber = 1 // TODO. different per repo
  return {
    create: async (state, data, emitWebhook) => {
      const { owner, repo, title, body, assignee, milestone, labels, assignees } = data
      const issue = {
        owner,
        repo,
        assignee,
        milestone,
        title,
        labels: labels || [],
        body: body || '',
        assignees,
        number: nextIssueNumber++
      }
      state.issues.push(issue)

      const repository = {
        name: repo
      }
      const sender = {
        login: 'test'
      }

      emitWebhook({ action: 'opened', issue, repository, sender })

      // TODO: mimic GitHub response
      return issue
    }
  }
}
