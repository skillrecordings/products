import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import deskStructure from './schemas/deskStructure'
import {codeInput} from '@sanity/code-input'
import {cloudinarySchemaPlugin} from 'sanity-plugin-cloudinary'
import {markdownSchema} from 'sanity-plugin-markdown'

export default defineConfig({
  name: 'default',
  title: 'testing-javascript',

  projectId: 'p9j29730',
  dataset: 'production',

  plugins: [
    deskTool({structure: deskStructure}),
    visionTool(),
    codeInput(),
    cloudinarySchemaPlugin(),
    markdownSchema(),
  ],

  schema: {
    types: schemaTypes,
  },
})
