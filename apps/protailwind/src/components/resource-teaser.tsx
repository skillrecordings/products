import {Module} from '@skillrecordings/skill-lesson/schemas/module'

const ResourceTeaser: React.FC<{resource: Module}> = ({resource}) => {
  return <article>{resource.title}</article>
}

export default ResourceTeaser
