import Layout from 'components/app/layout'
import * as React from 'react'
import CouponGenerator from '@skillrecordings/skill-lesson/admin/coupon-generator'
import {GetServerSideProps} from 'next'
import {getSdk} from '@skillrecordings/database'
import {stringify} from 'superjson'
import {
  Table,
  TableBody,
  TableRow,
  TableCaption,
  TableHead,
  TableHeader,
  TableCell,
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
} from '@skillrecordings/ui'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {trpc} from 'trpc/trpc.client'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'

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
  // const coupons: Coupon[] = JSON.parse(couponsData).json
  const formSchema = z.object({
    quantity: z.string(),
    // coupon
    maxUses: z.string(),
    expires: z.string().optional(),
    restrictedToProductId: z.string(),
    percentOff: z.string(),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: '1',
      maxUses: '1',
      restrictedToProductId: process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID,
      percentOff: '20',
    },
  })

  const {data: products} = trpc.products.getAllProducts.useQuery()
  const {data: coupons} = trpc.coupons.get.useQuery()

  const couponsMutation = trpc.coupons.create.useMutation()

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    couponsMutation.mutate(values)
  }

  form.watch((values) => {
    console.log(values)
  })

  return (
    <Layout meta={{title: 'Admin'}}>
      <main className="flex flex-grow flex-col items-center space-y-20 py-16">
        <section className="mx-auto w-full max-w-screen-lg space-y-5 px-5">
          <h3 className="text-2xl font-semibold">Generate new coupons</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <fieldset className="grid-cols-4 gap-5 md:grid">
                <FormField
                  name="maxUses"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Max uses</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          id="maxUses"
                          {...field}
                          required
                          onChange={field.onChange}
                          placeholder="-1"
                        />
                      </FormControl>
                      <FormDescription>Required</FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  name="expires"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Expires</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          id="expires"
                          {...field}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="percentOff"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Discount Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          id="percentOff"
                          {...field}
                          required
                          onChange={field.onChange}
                          placeholder={'20'}
                        />
                      </FormControl>
                      <FormDescription>Required</FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  name="restrictedToProductId"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Restricted to Product</FormLabel>
                      <FormControl>
                        <Select
                          required
                          {...field}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products?.map((product: SanityProduct) => (
                              <SelectItem value={product.productId}>
                                {product.title || product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>Required</FormDescription>
                    </FormItem>
                  )}
                />
              </fieldset>
              <div className="flex items-center gap-5">
                <FormField
                  name="quantity"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          id="quantity"
                          {...field}
                          required
                          min={1}
                          max={100}
                          onChange={field.onChange}
                          defaultValue={1}
                        />
                      </FormControl>
                      <FormDescription>Required</FormDescription>
                    </FormItem>
                  )}
                />
                <Button disabled={form.formState.isSubmitting} type="submit">
                  Generate
                </Button>
              </div>
            </form>
          </Form>
        </section>
        <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
        <section className="mx-auto w-full max-w-screen-lg space-y-5 px-5">
          <h3 className="text-2xl font-semibold">Coupons</h3>
          <Table>
            <TableCaption>All Epic Web Coupons</TableCaption>
            <TableHeader>
              <TableRow className="font-mono text-xs uppercase">
                <TableHead>id</TableHead>
                <TableHead>created at</TableHead>
                <TableHead>max uses</TableHead>
                <TableHead>discount percentage</TableHead>
                <TableHead>used count</TableHead>
                <TableHead>expires</TableHead>
                <TableHead>restricted to product id</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons ? (
                coupons.map((coupon) => {
                  return (
                    <TableRow key={coupon.id}>
                      <TableCell>{coupon.id}</TableCell>
                      <TableCell>{coupon.createdAt.toUTCString()}</TableCell>
                      <TableCell>{coupon.maxUses}</TableCell>
                      <TableCell>
                        {Number(coupon.percentageDiscount) * 100}%
                      </TableCell>
                      <TableCell>{coupon.usedCount}</TableCell>
                      <TableCell>{coupon.expires?.toUTCString()}</TableCell>
                      <TableCell>{coupon.restrictedToProductId}</TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  {new Array(6).fill('').map((_, i) => (
                    <TableCell className="w-full">
                      <Skeleton
                        key={i}
                        className="w-full bg-foreground/10 py-4"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      </main>
    </Layout>
  )
}

export default AdminPage

type Coupon = {
  id: string
  code: null | string
  createdAt: string
  expires: null | string
  maxUses: number
  default: boolean
  merchantCouponId: null | string
  status: number
  usedCount: number
  percentageDiscount: string
  restrictedToProductId: string
  bulkPurchaseId: null | string
}
