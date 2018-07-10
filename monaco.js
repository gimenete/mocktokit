import * as monaco from 'monaco-editor'

import nodeTypes from '@types/node/index.d.ts'
import octokitTypes from '@octokit/rest/index.d.ts'

let modifiedTypes = String(octokitTypes)
  .replace("import * as http from 'http'", '')
  .replace('declare namespace Github {', '')
  .replace('http.Agent', 'any')
  .replace('export = Github;', 'declare const github: Github;')
  .replace(/export /g, '')
  .replace(/Github\./g, '')
  .replace(`}\n\ndeclare class Github`, 'declare class Github')

monaco.languages.typescript.typescriptDefaults.addExtraLib(nodeTypes, '@types/node/index.d.ts')
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  modifiedTypes,
  '@octokit/rest/index.d.ts'
)

const initEditor = element => {
  const editor = monaco.editor.create(element, {
    value: [
      '// Type `github.` and it will start autocompleting',
      'module.exports = async () => {',
      '  await github.issues.create({',
      "    owner: 'gimenete',",
      "    repo: 'test-repo',",
      "    title: 'One issue'",
      '  })',
      '}'
    ].join('\n'),
    language: 'typescript',
    scrollBeyondLastLine: false,
    minimap: {
      enabled: false
    }
  })
  return editor
}

export default initEditor
