import S from '@sanity/desk-tool/structure-builder'
import UserIcon from 'part:@sanity/base/user-icon'

const collaborators = S.listItem()
  .title('Collaborators')
  .icon(UserIcon)
  .child(S.documentTypeList('collaborator').title('All Collaborators'))

export default collaborators
