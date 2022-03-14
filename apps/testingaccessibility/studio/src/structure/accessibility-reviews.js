import S from '@sanity/desk-tool/structure-builder'
import {GoSearch, GoEye, GoListUnordered} from 'react-icons/go'

const reviews = S.listItem()
  .title('Accessibility Reviews')
  .icon(GoSearch)
  .child(
    S.list()
      .title('Accessibility Reviews')
      .items([
        S.listItem()
          .title('Published reviews')
          .schemaType('review')
          .icon(GoEye)
          .child(
            S.documentList('review')
              .title('Published reviews')
              .showIcons(true)
              .menuItemGroups(S.documentTypeList('review').getMenuItems())
              .filter('_type == "review" && published == true')
              .child((documentId) =>
                S.document().documentId(documentId).schemaType('review'),
              ),
          ),
        S.documentTypeListItem('review')
          .title('All reviews')
          .icon(GoListUnordered),
      ]),
  )

export default reviews
