import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {getSdk} from '@skillrecordings/database'
import {type GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import PurchasesIndexTemplate, {
  type PurchasesIndexProps,
} from 'purchase-details/purchases-index-template'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  query,
}) => {
  const sessionToken = await getToken({req})
  const {getPurchasesForUser} = getSdk()
  const purchases = await getPurchasesForUser(sessionToken?.sub)
  return {
    props: {purchases: convertToSerializeForNextResponse(purchases)},
  }
}

const PurchasesIndex: React.FC<PurchasesIndexProps> = ({purchases}) => {
  return <PurchasesIndexTemplate purchases={purchases} />
}

export default PurchasesIndex
