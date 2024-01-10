import {MdArticle} from 'react-icons/md'

const articles = (S) =>
  S.listItem()
    .title('Articles')
    .icon(MdArticle)
    .child(S.documentTypeList('article').title('All Articles'))

export default articles
