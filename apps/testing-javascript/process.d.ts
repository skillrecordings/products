import {z} from 'zod'

const envVariables = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string(),
  NEXT_PUBLIC_SANITY_DATASET: z.string(),
  SANITY_EDITOR_TOKEN: z.string(),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string(),
  SANITY_IMPORT_DATA_FILE_PATH: z.string(),
})

envVariables.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

// declare namespace NodeJS {
//   export interface ProcessEnv {
//     NEXTAUTH_URL: string
//     NEXTAUTH_SECRET: string
//     NEXT_PUBLIC_SITE_TITLE: string
//     NEXT_PUBLIC_URL: string
//     NEXT_PUBLIC_PARTNER_FIRST_NAME: string
//     NEXT_PUBLIC_PARTNER_LAST_NAME: string
//     NEXT_PUBLIC_PARTNER_TWITTER: string
//     NEXT_PUBLIC_SEO_KEYWORDS: string
//     NEXT_PUBLIC_PRODUCT_DESCRIPTION: string
//     NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM: string
//     NEXT_PUBLIC_CONVERTKIT_TOKEN: string
//     NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY: string
//     NEXT_PUBLIC_SUPPORT_EMAIL: string
//     CONVERTKIT_BASE_URL: string
//     NEXT_PUBLIC_GOOGLE_ANALYTICS: string
//     NEXT_PUBLIC_DEFAULT_OG_IMAGE_URL: string
//     EMAIL_SERVER_HOST: string
//     EMAIL_SERVER_PORT: number
//     POSTMARK_KEY: string
//     NEXT_PUBLIC_PRODUCT_NAME: string
//     STRIPE_SECRET_TOKEN: string
//   }
// }
