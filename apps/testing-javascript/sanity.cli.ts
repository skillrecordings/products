import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'sanity-project-id',
    dataset: 'production',
  },
})
