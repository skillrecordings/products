import {SellableResource} from '../@types'
import {useViewer} from '../contexts/viewer-context'
import find from 'lodash/find'
import useSWR from 'swr'
import Axios from '../utils/axios'

const fetcher = (url: string) => {
  return Axios.get(url)
}

export const usePurchasedBundle = (
  bundles: SellableResource[],
): SellableResource | undefined => {
  const {sitePurchases} = useViewer()
  const purchasedBundle = find(bundles, {slug: sitePurchases[0]?.slug})
  const purchasedUrl = purchasedBundle?.url
  const swrKey = purchasedUrl ? [purchasedUrl] : null
  const {data} = useSWR(swrKey, fetcher)

  return data?.data
}
