import S from '@sanity/desk-tool/structure-builder'
import {GoPencil, GoEye, GoListUnordered} from 'react-icons/go'

const articles = S.listItem()
  .title('Articles')
  .icon(GoPencil)
  .child(
    S.list()
      .title('Articles')
      .items([
        S.listItem()
          .title('Published articles')
          .schemaType('article')
          .icon(GoEye)
          .child(
            S.documentList('article')
              .title('Published articles')
              .menuItemGroups(S.documentTypeList('article').getMenuItems())
              .filter('_type == "article" && published == true')
              .child((documentId) =>
                S.document().documentId(documentId).schemaType('article'),
              ),
          ),
        S.documentTypeListItem('article')
          .title('All articles')
          .icon(GoListUnordered),
      ]),
  )

export default articles
