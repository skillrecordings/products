import S from '@sanity/desk-tool/structure-builder'
import {GoPencil, GoEye, GoListUnordered} from 'react-icons/go'

const posts = S.listItem()
  .title('Posts')
  .icon(GoPencil)
  .child(
    S.list()
      .title('Posts')
      .items([
        S.listItem()
          .title('Published posts')
          .schemaType('post')
          .icon(GoEye)
          .child(
            S.documentList('post')
              .title('Published posts')
              .menuItemGroups(S.documentTypeList('post').getMenuItems())
              .filter('_type == "post" && published == true')
              .child((documentId) =>
                S.document().documentId(documentId).schemaType('post'),
              ),
          ),
        S.documentTypeListItem('post').title('All posts').icon(GoListUnordered),
      ]),
  )

export default posts
