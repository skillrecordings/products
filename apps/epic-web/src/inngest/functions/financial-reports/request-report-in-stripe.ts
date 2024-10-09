import {inngest} from 'inngest/inngest.server'
import type Stripe from 'stripe'
import {paymentOptions} from 'pages/api/skill/[...skillRecordings]'
import {GENERATE_DAILY_STRIPE_REPORT_EVENT} from 'inngest/events'

const stripe = paymentOptions.providers.stripe?.paymentClient as Stripe

type ReportRun = {
  id: string
  object: 'reporting.report_run'
  created: number
  status: 'pending' | 'succeeded' | 'failed'
  result?: {
    url: string
  }
}

export const generateStripeReport = inngest.createFunction(
  {id: 'generate-daily-stripe-report', name: 'Generate Daily Stripe Report'},
  {event: GENERATE_DAILY_STRIPE_REPORT_EVENT},
  async ({event, step}) => {
    const targetDate = event.data.date
      ? new Date(event.data.date)
      : new Date(Date.now() - 86400000) // Default to yesterday if no date provided

    targetDate.setUTCHours(0, 0, 0, 0)

    const startDate = Math.floor(targetDate.getTime() / 1000)
    const endDate = Math.floor(targetDate.setUTCHours(23, 59, 59, 999) / 1000)

    const reportId = await step.run('create-report', async () => {
      const reportRun = (await stripe.reporting.reportRuns.create({
        report_type: 'balance_change_from_activity.itemized.3',
        parameters: {
          interval_start: startDate,
          interval_end: endDate,
          timezone: 'Etc/UTC',
          columns: [
            'balance_transaction_id',
            'created',
            'reporting_category',
            'gross',
            'fee',
            'net',
            'payment_metadata[productId]',
          ],
        },
      })) as ReportRun

      return reportRun.id
    })

    const reportUrl = await step.run('poll-report', async () => {
      let report: ReportRun
      do {
        await new Promise<void>((resolve) => setTimeout(resolve, 300000)) // Wait for 5 minutes
        report = (await stripe.reporting.reportRuns.retrieve(
          reportId,
        )) as ReportRun
      } while (report.status !== 'succeeded' && report.status !== 'failed')

      if (report.status === 'failed') {
        throw new Error('Report generation failed')
      }

      return report.result?.url
    })

    if (!reportUrl) {
      throw new Error('No URL found in report result')
    }

    const STRIPE_KCD_KEY = process.env.STRIPE_SECRET_TOKEN
    if (!STRIPE_KCD_KEY) {
      throw new Error('STRIPE_KCD_KEY is not set in environment variables')
    }

    //TODO --
    // FIGURE OUT WHERE TO SAVE THIS FILE TO PROCESS THE REPORT AND GET THE FINAL DATA!!

    // const filePath = await step.run('download-report', async () => {
    //   const response = await fetch(reportUrl, {
    //     headers: {
    //       Authorization: `Bearer ${STRIPE_KCD_KEY}`,
    //     },
    //   })

    //   if (!response.ok) {
    //     throw new Error(`Failed to download report: ${response.statusText}`)
    //   }

    //   return filePath
    // })

    return {
      message: 'Stripe report generated and downloaded successfully',
      //   filePath,
      date: targetDate.toISOString().split('T')[0],
    }
  },
)
