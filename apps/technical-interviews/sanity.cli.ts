import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'sanity_project_id',
    dataset: 'production',
  },
})
