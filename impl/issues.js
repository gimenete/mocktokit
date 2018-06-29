const produce = require('immer').default

module.exports = ({ webhook }) => {
  return {
    'create': async (state, { params, body: data }) => {
      const { owner, repo } = params
      const { title, body, assignee, milestone, labels, assignees } = data
      const issue = {
        owner,
        repo,
        assignee,
        milestone,
        title,
        labels: labels || [],
        body: body || '',
        assignees
      }
      state.issues.push(issue)
      // TODO: send event to webhook

      // TODO: mimic GitHub response
      return issue
    }
  }
}
