declare namespace NodeJS {
  export interface ProcessEnv {
    STRIPE_SECRET_TOKEN: string
    EMAIL_SERVER_PORT: number
    NEXT_PUBLIC_DEFAULT_PRODUCT_ID: string
    SLACK_ANNOUNCE_CHANNEL_ID: string
    STRIPE_WEBHOOK_SECRET: string
  }
}
