import {defineConfig} from 'sanity'
// import {deskTool} from 'sanity/desk'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import deskStructure from './schemas/deskStructure'
import {codeInput} from '@sanity/code-input'
import {cloudinarySchemaPlugin} from 'sanity-plugin-cloudinary'
import {taxonomyManager} from 'sanity-plugin-taxonomy-manager'
import {markdownSchema} from 'sanity-plugin-markdown'

export default defineConfig({
  name: 'default',
  title: 'Badass Courses',
  projectId: 'pnuo5qcl',
  dataset: 'production',
  plugins: [
    // deskTool({structure: deskStructure}),
    structureTool({structure: deskStructure}),
    visionTool(),
    codeInput(),
    cloudinarySchemaPlugin(),
    taxonomyManager({}),
    markdownSchema(),
  ],
  schema: {
    types: schemaTypes,
  },
})
