import {GoPencil, GoEye, GoListUnordered} from 'react-icons/go'

const caseStudies = (S) =>
  S.listItem()
    .title('Case Studies')
    .icon(GoPencil)
    .child(
      S.list()
        .title('Case Studies')
        .items([
          S.listItem()
            .title('Published case studies')
            .schemaType('caseStudy')
            .icon(GoEye)
            .child(
              S.documentList('caseStudy')
                .title('Published case studies')
                .menuItemGroups(S.documentTypeList('caseStudy').getMenuItems())
                .filter('_type == "caseStudy" && state == "published"')
                .child((documentId) =>
                  S.document().documentId(documentId).schemaType('caseStudy'),
                ),
            ),
          S.documentTypeListItem('caseStudy')
            .title('All case studies')
            .icon(GoListUnordered),
        ]),
    )

export default caseStudies
