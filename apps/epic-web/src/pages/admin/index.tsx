import Layout from 'components/app/layout'
import * as React from 'react'
import {GetServerSideProps} from 'next'
import {Decimal, getSdk} from '@skillrecordings/database'
import {stringify} from 'superjson'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormDescription,
  Button,
  Skeleton,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar,
  FormMessage,
} from '@skillrecordings/ui'
import {format} from 'date-fns'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {trpc} from 'trpc/trpc.client'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {cn} from '@skillrecordings/ui/utils/cn'
import {CalendarIcon} from '@heroicons/react/outline'
import CouponDataTable from '@skillrecordings/ui/admin/coupon-data-table'
import CouponGeneratorForm from '@skillrecordings/ui/admin/coupon-generator-form'
// import CouponDataTable from 'admin/coupon-data-table'

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
  const {data: products} = trpc.products.getAllProducts.useQuery()
  const {data: coupons, status: couponsStatus} = trpc.coupons.get.useQuery()

  const createCouponsMutation = trpc.coupons.create.useMutation()

  return (
    <Layout meta={{title: 'Admin'}}>
      <main className="flex flex-grow flex-col items-center space-y-5 py-16">
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
