import {MdStar} from 'react-icons/md'

const bonuses = (S) =>
  S.listItem()
    .title('Bonus Modules')
    .icon(MdStar)
    .child(
      S.documentTypeList('module')
        .filter('moduleType == "bonus"')
        .title('All Bonuses'),
    )

export default bonuses
