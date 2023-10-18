export const LESSON_COMPLETED_EVENT = 'progress/lesson.completed'

export type LessonCompleted = {
  name: typeof LESSON_COMPLETED_EVENT
  data: {
    lessonSanityId?: string
    lessonSlug: string
  }
}

export const PURCHASE_TRANSFERRED_EVENT = 'commerce/purchase_transferred'

export type PurchaseTransferred = {
  name: typeof PURCHASE_TRANSFERRED_EVENT
  data: {
    purchaseId: string
    sourceUserId: string
    targetUserId: string
  }
}
