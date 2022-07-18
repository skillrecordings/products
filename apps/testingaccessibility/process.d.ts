declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    GITHUB_ID: string
    GITHUB_SECRET: string
    GOOGLE_ID: string
    GOOGLE_SECRET: string
    HASURA_PROJECT_ENDPOINT: string
    HASURA_ADMIN_SECRET: string
    POSTMARK_KEY: string
    STRIPE_SECRET_TOKEN: string
    STRIPE_WEBHOOK_SECRET: string
    ALGOLIA_API_WRITE_KEY: string
    SANITY_WEBHOOK_SECRET: string
    NEXT_PUBLIC_ALGOLIA_APPLICATION_ID: string
    NEXT_PUBLIC_SELLING_LIVE: string
    NEXT_PUBLIC_SUPPORT_EMAIL: string
    EMAIL_SERVER_HOST: string
    EMAIL_SERVER_PORT: number
    NEXT_PUBLIC_DEFAULT_PRODUCT_ID: string
    NEXT_PUBLIC_OG_IMAGE_URI: string
    NEXT_PUBLIC_URL: string
    CONVERTKIT_PURCHASED_TAG_ID: string
    SLACK_ANNOUNCE_CHANNEL_ID: string
    SLACK_FEEDBACK_CHANNEL_ID: string
    NEXT_PUBLIC_SITE_TITLE: string
    SLACK_TOKEN: string
  }
}
