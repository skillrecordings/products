import DevBundles from '../../data/bundles.development.json'
import ProdBundles from '../../data/bundles.production.json'

const getBundles = () => {
  return process.env.NODE_ENV === 'production' ? ProdBundles : DevBundles
}

export default getBundles
