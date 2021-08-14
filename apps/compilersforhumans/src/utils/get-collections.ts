import DevCollections from '../../data/collections.development.json'
import ProdCollections from '../../data/collections.production.json'

const getCollections = () => {
  return process.env.NODE_ENV === 'production'
    ? ProdCollections
    : DevCollections
}

export default getCollections
