import {ModuleProgress} from '@skillrecordings/skill-lesson/video/module-progress'
import OpenAI from 'openai'
import {Account, User} from 'next-auth'
import {AdapterUser} from 'next-auth/adapters'

export const OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT =
  'user/oauth-provider-account-linked'

export type OauthProviderAccountLinked = {
  name: typeof OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT
  data: {
    account: Account
    profile: User | AdapterUser
  }
}

export const EMAIL_WRITING_REQUEST_COMPLETED_EVENT = 'email/ai-email-completed'

export type EmailWritingRequestCompleted = {
  name: typeof EMAIL_WRITING_REQUEST_COMPLETED_EVENT
  data: {
    lessonId: string
    body: string
    subject: string
    fullPrompt: OpenAI.ChatCompletionMessage[]
  }
}

export const EMAIL_WRITING_REQUESTED_EVENT = 'email/writing-requested'

export type EmailWritingRequested = {
  name: typeof EMAIL_WRITING_REQUESTED_EVENT
  data: {
    currentLesson: any
    moduleProgress: ModuleProgress
    currentModuleSlug: string
    currentSectionSlug?: string
    currentLessonSlug: string
    additionalContext?: string
    previousDraft?: string
    editorComments?: string
  }
}

export const TIP_VIDEO_UPLOADED_EVENT = 'tip/video.uploaded'

export type NewTipVideo = {
  name: typeof TIP_VIDEO_UPLOADED_EVENT
  data: {
    tipId: string
    videoResourceId: string
  }
}

export const TIP_VIDEO_TRANSCRIPT_CREATED_EVENT = 'tip/video.transcript.created'
export type TranscriptCreatedEvent = {
  name: typeof TIP_VIDEO_TRANSCRIPT_CREATED_EVENT
  data: {
    transcript: {
      text: string
      srt: string
    }
    videoResourceId: string
  }
}

export const TIP_VIDEO_SRT_READY_EVENT = 'tip/video.srt.ready'

export type SRTReadyEvent = {
  name: typeof TIP_VIDEO_SRT_READY_EVENT
  data: {
    srt: string
    muxAssetId: string
    videoResourceId: string
    attempt?: number
  }
}

export const TIP_VIDEO_LLM_SUGGESTIONS_CREATED_EVENT =
  'tip/video.llm.suggestions.created'

export type LLMSuggestionsCreated = {
  name: typeof TIP_VIDEO_LLM_SUGGESTIONS_CREATED_EVENT
  data: {
    llmSuggestions: any
    videoResourceId: string
  }
}

// =============================================================================
// Generic Video Resource Events (for all content types, not just tips)
// =============================================================================

export const VIDEO_RESOURCE_CREATED_EVENT = 'video/resource.created'

export type VideoResourceCreated = {
  name: typeof VIDEO_RESOURCE_CREATED_EVENT
  data: {
    videoResourceId: string
    originalMediaUrl: string
    parentResourceId?: string // tip, lesson, exercise, etc.
    parentResourceType?: string
  }
}

export const VIDEO_TRANSCRIPT_READY_EVENT = 'video/transcript.ready'

export type VideoTranscriptReady = {
  name: typeof VIDEO_TRANSCRIPT_READY_EVENT
  data: {
    videoResourceId: string
    transcript: {
      text: string
      srt: string
    }
  }
}

export const VIDEO_SRT_READY_EVENT = 'video/srt.ready'

export type VideoSrtReady = {
  name: typeof VIDEO_SRT_READY_EVENT
  data: {
    videoResourceId: string
    srt: string
    muxAssetId?: string
  }
}

// =============================================================================
// SEO Description Generation Events
// =============================================================================

export const SEO_DESCRIPTION_GENERATION_REQUESTED =
  'seo/description.generation.requested'

export type SeoDescriptionGenerationRequested = {
  name: typeof SEO_DESCRIPTION_GENERATION_REQUESTED
  data: {
    resourceId: string
    resourceType: string // 'tip' | 'lesson' | 'exercise' | etc.
    transcript: string
  }
}

export const SEO_DESCRIPTION_GENERATED = 'seo/description.generated'

export type SeoDescriptionGenerated = {
  name: typeof SEO_DESCRIPTION_GENERATED
  data: {
    resourceId: string
    description: string
  }
}

// =============================================================================
// Union type for all events
// =============================================================================

export type InngestEvents =
  | OauthProviderAccountLinked
  | EmailWritingRequestCompleted
  | EmailWritingRequested
  | NewTipVideo
  | TranscriptCreatedEvent
  | SRTReadyEvent
  | LLMSuggestionsCreated
  | VideoResourceCreated
  | VideoTranscriptReady
  | VideoSrtReady
  | SeoDescriptionGenerationRequested
  | SeoDescriptionGenerated
