import {MdOutlineViewModule} from 'react-icons/md'

const tutorials = (S) =>
  S.listItem()
    .title('Tutorials')
    .icon(MdOutlineViewModule)
    .child(
      S.documentTypeList('module')
        .filter('moduleType == "tutorial"')
        .title('All Tutorials'),
    )

export default tutorials
