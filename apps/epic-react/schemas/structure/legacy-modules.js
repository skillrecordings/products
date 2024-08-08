import {FaSkull} from 'react-icons/fa'

const legacyModules = (S) =>
  S.listItem()
    .title('Modules (legacy)')
    .icon(FaSkull)
    .child(
      S.documentTypeList('module')
        .filter('moduleType == "legacy-module"')
        .title('All Legacy Modules'),
    )

export default legacyModules
