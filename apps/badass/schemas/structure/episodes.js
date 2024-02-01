import {IoMdMicrophone} from 'react-icons/io'

const products = (S) =>
  S.listItem()
    .title('Episodes')
    .icon(IoMdMicrophone)
    .child(S.documentTypeList('podcastEpisode').title('All Episodes'))

export default products
