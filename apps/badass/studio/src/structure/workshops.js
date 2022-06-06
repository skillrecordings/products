import S from '@sanity/desk-tool/structure-builder'
import {GoGear, GoEye, GoListUnordered} from 'react-icons/go'

const workshops = S.listItem()
  .title('Workshops')
  .icon(GoGear)
  .child(
    S.list()
      .title('Workshops')
      .items([
        S.listItem()
          .title('Published workshops')
          .schemaType('workshop')
          .icon(GoEye)
          .child(
            S.documentList('workshop')
              .title('Published workshops')
              .menuItemGroups(S.documentTypeList('workshop').getMenuItems())
              .filter('_type == "workshop" && published == true')
              .child((documentId) =>
                S.document().documentId(documentId).schemaType('workshop'),
              ),
          ),
        S.documentTypeListItem('workshop')
          .title('All workshops')
          .icon(GoListUnordered),
      ]),
  )

export default workshops
