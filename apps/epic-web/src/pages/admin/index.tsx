import Layout from 'components/app/layout'
import * as React from 'react'
import {GetServerSideProps} from 'next'
import {Decimal, getSdk} from '@skillrecordings/database'
import {stringify} from 'superjson'
import {Skeleton} from '@skillrecordings/ui'
import {trpc} from 'trpc/trpc.client'
import CouponDataTable from '@skillrecordings/ui/admin/coupon-data-table'
import CouponGeneratorForm from '@skillrecordings/ui/admin/coupon-generator-form'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query, params} = context
  const {getCoupons} = getSdk()
  const coupons = await getCoupons()

  return {
    props: {
      couponsData: stringify(coupons),
    },
  }
}

const AdminPage: React.FC<{couponsData: any}> = ({}) => {
  const {data: coupons, status: couponsStatus} = trpc.coupons.get.useQuery()

  return (
    <Layout meta={{title: 'Admin'}}>
      <header className="mx-auto w-full max-w-screen-lg px-5 pt-10 text-right font-mono text-4xl font-black uppercase text-foreground/10 sm:text-5xl">
        <h1>/Admin</h1>
      </header>
      <main className="flex flex-grow flex-col items-center space-y-5 pb-16">
        <h2 className="w-full max-w-screen-lg px-5 text-left text-3xl font-bold">
          Coupons
        </h2>
        <section className="mx-auto w-full max-w-screen-lg space-y-5 px-5 pt-8">
          <h3 className="text-2xl font-medium">Create new</h3>
          <CouponGeneratorForm />
        </section>
        <section className="mx-auto w-full max-w-screen-lg px-5 pt-10">
          {couponsStatus === 'loading' ? (
            <Skeleton className="bg-foreground/10 py-24" />
          ) : (
            coupons && <CouponDataTable coupons={coupons} />
          )}
        </section>
      </main>
    </Layout>
  )
}

export default AdminPage

export type Coupon = {
  id: string
  code: null | string
  createdAt: Date
  expires: null | Date
  maxUses: number
  default: boolean
  merchantCouponId: null | string
  status: number
  usedCount: number
  percentageDiscount: Decimal
  restrictedToProductId: null | string
  bulkPurchaseId: null | string
}
