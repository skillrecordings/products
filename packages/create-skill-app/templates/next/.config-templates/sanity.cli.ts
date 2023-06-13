import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '{{sanityProjectId}}',
    dataset: 'production',
  },
})
