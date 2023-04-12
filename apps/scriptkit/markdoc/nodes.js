import {Fence} from '../src/components/markdoc/Fence'

const nodes = {
  document: {
    render: undefined,
  },
  th: {
    attributes: {
      scope: {
        type: String,
        default: 'col',
      },
    },
    render: (props) => <th {...props} />,
  },
  fence: {
    render: Fence,
    attributes: {
      language: {
        type: String,
      },
    },
  },
}

export default nodes
