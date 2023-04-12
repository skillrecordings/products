import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import deskStructure from './schemas/deskStructure'
import {codeInput} from '@sanity/code-input'
import {cloudinarySchemaPlugin} from 'sanity-plugin-cloudinary'
import {taxonomyManager} from 'sanity-plugin-taxonomy-manager'

export default defineConfig({
  name: 'default',
  title: 'Epic Web Dev',
  projectId: 'i1a93n76',
  dataset: 'production',
  plugins: [
    deskTool({structure: deskStructure}),
    visionTool(),
    codeInput(),
    cloudinarySchemaPlugin(),
    taxonomyManager(),
  ],
  schema: {
    types: schemaTypes,
  },
})
