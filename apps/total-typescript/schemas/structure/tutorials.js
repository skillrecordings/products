import {MdLightbulb} from 'react-icons/md'

const tutorials = (S) =>
  S.listItem()
    .title('Tutorials')
    .icon(MdLightbulb)
    .child(
      S.documentTypeList('module')
        .filter('moduleType == "tutorial"')
        .title('All Tutorials'),
    )

export default tutorials
