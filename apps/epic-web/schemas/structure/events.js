import {MdEvent} from 'react-icons/md'
import {defineType} from 'sanity'

const events = (S) =>
  S.listItem()
    .title('Events')
    .icon(MdEvent)
    .child(S.documentTypeList('event').title('All Events'))

export default events
