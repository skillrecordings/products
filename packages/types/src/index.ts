export type Resource = {
  title: string
  slug: string
  description: string
  icon_url?: string
  path: string
  type: string
  id: number
  items: any[]
  url: string
  square_cover_480_url: string
  square_cover_large_url: string
  duration: number
}

export interface AvailableUpgrade {
  id: number
  price: number
  slug: string
  url: string
}

export type SellableResource = Resource & {
  price: number
  full_price: number
  site?: string
  bulk: boolean
  available_upgrades?: AvailableUpgrade[]
}

export type Price = {
  price: number
  price_coupon: string
  price_message: string
  coupon_error: string
  full_price: number
  coupon: Coupon
  bulk_discount: string
  available_coupons: Coupon[]
}

export type Coupon = {
  coupon_code: string
  coupon_discount: number
  coupon_region_restricted_to: string
  coupon_region_restricted_to_name: string
  coupon_expires_at: number
}

export type LessonResource = Resource & {
  dash_url: string
  hls_url: string
  media_url: string
  lesson_view_url: string
  id: string | number
  tags: any[]
  lessons: any[]
  completed: boolean
  duration: number
  instructor: any
}

export type StripeAccount = {
  stripe_customer_id: string
  subscriptions: StripeSubscription[]
}

export type StripeSubscription = {
  stripe_subscription_id: string
}

export type Viewer = {
  id: number
  email: string
  contact_id: string
  name: string
  is_pro: boolean
  is_instructor: boolean
  created_at: number
  discord_id: string
  timezone: string
  opted_out: boolean
  purchased: any[]
  avatar_url: string
  accounts: StripeAccount[]
}

export type Achievement = {
  title: string
  earned: boolean
  image: string
  link?: {
    children: string
    onClick: () => void
  }
}

export type QuizResource = {
  title?: string
  slug?: string
  questions: QuestionSet
}

export type QuestionResource = {
  question: string
  type: 'multiple-choice' | 'multiple-image-choice' | 'essay' | 'code'
  tagId?: number
  correct?: string[] | string
  answer?: string
  choices?: Choice[]
  template?: string
  code?: {
    filename: string
    active: boolean
    code: string
  }[]
}

export type QuestionSet = {
  [key: string]: QuestionResource
}

export type Choice = {
  answer: string
  label?: string
  image?: string
}

export const EXISTING_BULK_COUPON = 'EXISTING_BULK_COUPON'
export const NEW_BULK_COUPON = 'NEW_BULK_COUPON'
export const NEW_INDIVIDUAL_PURCHASE = 'NEW_INDIVIDUAL_PURCHASE'
export const INDIVIDUAL_TO_BULK_UPGRADE = 'INDIVIDUAL_TO_BULK_UPGRADE'
