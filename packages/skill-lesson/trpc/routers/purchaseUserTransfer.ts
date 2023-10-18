import {z} from 'zod'
import {
  getSdk,
  prisma,
  type PurchaseUserTransfer,
  type PurchaseUserTransferState,
} from '@skillrecordings/database'

import {type NextAuthOptions, type Theme} from 'next-auth'
import process from 'process'
import {format} from 'date-fns'
import {getToken} from 'next-auth/jwt'
import {type Stripe, stripe} from '@skillrecordings/commerce-server'
import {
  type HTMLEmailParams,
  sendServerEmail,
  type TextEmailParams,
} from '@skillrecordings/skill-api'
import {publicProcedure, router} from '../trpc.server'
import mjml2html from 'mjml'
import {PURCHASE_TRANSFERRED_EVENT} from '../../inngest/events'
import {Inngest} from 'inngest'

const canInitiateTransfer = async ({
  purchaseUserTransfer,
}: {
  purchaseUserTransfer: PurchaseUserTransfer | null
}) => {
  if (!purchaseUserTransfer) {
    return false
  }

  const {updatePurchaseUserTransferTransferState} = getSdk()

  const isNotAvailable = purchaseUserTransfer.transferState !== 'AVAILABLE'
  const isExpired =
    purchaseUserTransfer.expiresAt &&
    purchaseUserTransfer.expiresAt < new Date()

  switch (true) {
    case isNotAvailable:
      return false
    case isExpired:
      await updatePurchaseUserTransferTransferState({
        id: purchaseUserTransfer.id,
        transferState: 'EXPIRED',
      })
      return false
  }

  return true
}

const initiateTransfer = async ({
  purchaseUserTransferId,
  toEmail,
  nextAuthOptions,
}: {
  purchaseUserTransferId: string
  toEmail: string
  nextAuthOptions?: NextAuthOptions
}) => {
  const {getPurchaseUserTransferById, findOrCreateUser} = getSdk()
  const {user: toUser} = await findOrCreateUser(toEmail.toLowerCase())
  const purchaseUserTransfer = await getPurchaseUserTransferById({
    id: purchaseUserTransferId,
  })
  const canTransfer = await canInitiateTransfer({purchaseUserTransfer})

  if (canTransfer) {
    const initiatedTransfer = await prisma.purchaseUserTransfer.update({
      where: {id: purchaseUserTransferId},
      data: {
        targetUserId: toUser.id,
        transferState: 'INITIATED',
      },
    })

    nextAuthOptions &&
      (await sendServerEmail({
        email: toUser.email,
        callbackUrl: `${process.env.NEXT_PUBLIC_URL}/transfer/${initiatedTransfer.id}`,
        nextAuthOptions,
        type: 'transfer',
        html: defaultHtml,
        text: defaultText,
        expiresAt: initiatedTransfer.expiresAt,
      }))
  }
}

export const purchaseUserTransferRouter = router({
  initiate: publicProcedure
    .input(
      z.object({
        purchaseUserTransferId: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {getPurchaseUserTransferById} = getSdk()
      const purchaseUserTransfer = await getPurchaseUserTransferById({
        id: input.purchaseUserTransferId,
      })

      if (!purchaseUserTransfer) {
        throw new Error('No purchaseUserTransfer found')
      }

      return await initiateTransfer({
        purchaseUserTransferId: purchaseUserTransfer.id,
        toEmail: input.email,
        nextAuthOptions: ctx.nextAuthOptions,
      })
    }),
  cancel: publicProcedure
    .input(
      z.object({
        purchaseUserTransferId: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {getPurchaseUserTransferById} = getSdk()
      const purchaseUserTransfer = await getPurchaseUserTransferById({
        id: input.purchaseUserTransferId,
      })

      if (!purchaseUserTransfer) {
        throw new Error('No purchaseUserTransfer found')
      }

      if (purchaseUserTransfer.transferState !== 'INITIATED') {
        throw new Error('This transfer is not available')
      }

      await prisma.purchaseUserTransfer.update({
        where: {id: purchaseUserTransfer.id},
        data: {
          transferState: 'CANCELED',
          canceledAt: new Date(),
        },
      })

      return await prisma.purchaseUserTransfer.create({
        data: {
          purchaseId: purchaseUserTransfer.purchaseId,
          transferState: 'AVAILABLE',
          expiresAt: purchaseUserTransfer.expiresAt,
          sourceUserId: purchaseUserTransfer.sourceUserId,
        },
      })
    }),
  accept: publicProcedure
    .input(
      z.object({
        purchaseUserTransferId: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      const {
        updatePurchaseUserTransferTransferState,
        getPurchaseUserTransferById,
        getUserById,
      } = getSdk()
      const purchaseUserTransfer = await getPurchaseUserTransferById({
        id: input.purchaseUserTransferId,
      })
      const user = token
        ? await getUserById({
            where: {
              id: token.sub as string,
            },
          })
        : null

      if (!user) {
        throw new Error('No user found')
      }

      if (!purchaseUserTransfer) {
        throw new Error('No purchaseUserTransfer found')
      }

      if (purchaseUserTransfer.targetUserId !== user.id) {
        throw new Error('You are not the target user')
      }

      if (purchaseUserTransfer.transferState !== 'INITIATED') {
        throw new Error('This transfer is not available')
      }

      if (
        purchaseUserTransfer.expiresAt &&
        purchaseUserTransfer.expiresAt < new Date()
      ) {
        await updatePurchaseUserTransferTransferState({
          id: purchaseUserTransfer.id,
          transferState: 'EXPIRED',
        })
        throw new Error('This transfer has expired')
      }

      const purchase = await prisma.purchase.findUnique({
        where: {
          id: purchaseUserTransfer.purchaseId,
        },
        select: {
          merchantCharge: {
            select: {
              id: true,
              merchantCustomer: true,
            },
          },
        },
      })

      if (!purchase) {
        throw new Error('No purchase found')
      }

      if (purchase?.merchantCharge?.merchantCustomer) {
        const {identifier} = purchase.merchantCharge.merchantCustomer
        const existingCustomer = (await stripe.customers.retrieve(
          identifier,
        )) as Stripe.Response<Stripe.Customer>

        await stripe.customers.update(identifier, {
          email: user.email,
          name: user.name || existingCustomer.name || user.email,
        })

        const updateCharge = prisma.merchantCharge.update({
          where: {
            id: purchase.merchantCharge.id,
          },
          data: {
            userId: user.id,
          },
        })

        const updateCustomer = prisma.merchantCustomer.update({
          where: {
            id: purchase.merchantCharge.merchantCustomer.id,
          },
          data: {
            userId: user.id,
          },
        })

        await prisma.$transaction([updateCharge, updateCustomer])
      }

      const updatePurchase = prisma.purchase.update({
        where: {
          id: purchaseUserTransfer.purchaseId,
        },
        data: {
          userId: user.id,
        },
      })

      const updatePurchaseUserTransfer = prisma.purchaseUserTransfer.update({
        where: {
          id: purchaseUserTransfer.id,
        },
        data: {
          transferState: 'COMPLETED',
          completedAt: new Date(),
        },
      })

      if (process.env.INNGEST_EVENT_KEY) {
        const inngest = new Inngest({
          id:
            process.env.INNGEST_APP_NAME ||
            process.env.NEXT_PUBLIC_SITE_TITLE ||
            'Purchase Transfer',
          eventKey: process.env.INNGEST_EVENT_KEY,
        })

        await inngest.send({
          name: PURCHASE_TRANSFERRED_EVENT,
          data: {
            purchaseId: purchaseUserTransfer.purchaseId,
            sourceUserId: purchaseUserTransfer.sourceUserId,
            targetUserId: purchaseUserTransfer.targetUserId,
          },
          user,
        })
      }

      const [newPurchase, completedTransfer] = await prisma.$transaction([
        updatePurchase,
        updatePurchaseUserTransfer,
      ])

      return {
        newPurchase,
        completedTransfer,
      }
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {getPurchaseUserTransferById} = getSdk()
      return await getPurchaseUserTransferById({
        id: input.id,
      })
    }),
  forPurchaseId: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        sourceUserId: z.string().optional(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token && !input.sourceUserId) {
        return []
      }
      return await prisma.purchaseUserTransfer.findMany({
        where: {
          sourceUserId: token?.sub || input.sourceUserId,
          purchaseId: input.id,
          expiresAt: {
            gte: new Date(),
          },
        },
      })
    }),
})

function defaultHtml(
  {url, host, email, expires}: HTMLEmailParams,
  theme: Theme,
) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`
  const escapedHost = `${host.replace(/\./g, '&#8203;.')}`

  // Some simple styling options
  const backgroundColor = '#F9FAFB'
  const textColor = '#3E3A38'
  const mainBackgroundColor = '#ffffff'
  const buttonBackgroundColor = theme ? theme.brandColor : '#F9FAFB'
  const buttonTextColor = '#ffffff'

  // use datefns to format the expiration date with Pacific timezone
  const formattedExpires = expires ? format(expires, 'PPPPppp') : null

  let expiresText = `        <mj-text color='${textColor}' align='center'  padding='30px 90px 10px 90px'>
          The link is valid for 24 hours or until it is used once. You will stay logged in for 60 days. <a href='${process.env.NEXT_PUBLIC_URL}/login' target='_blank'>Click here to request another link</a>.
        </mj-text>`

  if (formattedExpires) {
    expiresText = `        <mj-text color='${textColor}' align='center'  padding='30px 90px 10px 90px'>
          This link is valid until ${formattedExpires}.
        </mj-text>`
  }

  const {html} = mjml2html(`
<mjml>
  <mj-head>
    <mj-font name='Inter' href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600' />
    <mj-attributes>
      <mj-all font-family='Inter, Helvetica, sans-serif' line-height='1.5' />
    </mj-attributes>
    <mj-raw>
      <meta name='color-scheme' content='light' />
      <meta name='supported-color-schemes' content='light' />
    </mj-raw>
  </mj-head>
  <mj-body background-color='${backgroundColor}'>
    ${
      theme?.logo &&
      `<mj-section padding='10px 0 10px 0'>
          <mj-column background-color='${backgroundColor}'>
            <mj-image alt='${process.env.NEXT_PUBLIC_SITE_TITLE}' width='180px' src='${theme.logo}' />
          </mj-column>
        </mj-section>`
    }
    <mj-section padding-top='0'>
      <mj-column background-color='${mainBackgroundColor}' padding='16px 10px'>
        <mj-text font-size='18px' color='${textColor}' align='center' padding-bottom='20px'>
          Accept your license <strong color='${textColor}'>${escapedEmail}</strong> for ${
    process.env.NEXT_PUBLIC_SITE_TITLE
  }.
        </mj-text>
        <mj-button href='${url}' background-color='${buttonBackgroundColor}' color='${buttonTextColor}' target='_blank' border-radius='6px' font-size='18px' font-weight='bold'>
          Accept License
        </mj-button>

        ${expiresText}
        <mj-text color='${textColor}' align='center' padding='10px 90px 10px 90px'>
          If you need additional help, reply!
        </mj-text>
        <mj-text color='gray' align='center' padding-top='40px'>
          If this email is unexpected you can safely ignore it.
        </mj-text>
    </mj-section>
  </mj-body>
</mjml>
`)

  return html
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function defaultText({url, host, expires}: TextEmailParams) {
  const formattedExpires = expires ? format(expires, 'PPPPppp') : null

  return `Log in to ${host}\n${url}\n\nexpires at ${formattedExpires}`
}
