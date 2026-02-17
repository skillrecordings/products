import {inngest} from 'inngest/inngest.server'
import {sanityWriteClient} from '@skillrecordings/skill-lesson/utils/sanity-server'
import {
  VIDEO_TRANSCRIPT_READY_EVENT,
  SEO_DESCRIPTION_GENERATED,
} from 'inngest/events'
import OpenAI from 'openai'

/**
 * Auto-Generate SEO Description from Transcript
 *
 * Triggered when a video transcript becomes ready.
 * 1. Waits 2 minutes to allow parent resource to be linked
 * 2. Generates and stores description on the videoResource
 * 3. If a parent resource exists and has no description, copies it there too
 */
export const autoGenerateSeoDescription = inngest.createFunction(
  {
    id: 'auto-generate-seo-description',
    name: 'Auto-Generate SEO Description from Transcript',
    retries: 2,
  },
  {event: VIDEO_TRANSCRIPT_READY_EVENT},
  async ({event, step}) => {
    const {videoResourceId, transcript} = event.data

    // Wait 2 minutes to allow time for the video to be linked to a lesson
    await step.sleep('Wait for parent resource to be linked', '2m')

    // Check if OpenAI is configured
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.warn('SEO Description: OPENAI_API_KEY not configured, skipping')
      return {
        skipped: true,
        reason: 'OpenAI API key not configured',
      }
    }

    // Check if videoResource already has a generated description
    const videoResource = await step.run('Check video resource', async () => {
      return sanityWriteClient.fetch(
        `*[_id == $videoResourceId][0]{_id, generatedDescription, title}`,
        {videoResourceId},
      )
    })

    if (videoResource?.generatedDescription?.trim()) {
      console.info(
        `SEO Description: Video ${videoResourceId} already has a generated description`,
      )
      return {
        skipped: true,
        reason: 'Video already has a generated description',
        videoResourceId,
      }
    }

    // Find parent resource (tip, lesson, exercise, etc.) that contains this video
    const parentResource = await step.run('Find parent resource', async () => {
      const result = await sanityWriteClient.fetch(
        `
        *[
          _type in ["tip", "lesson", "exercise", "explainer", "solution", "article"] &&
          references($videoResourceId)
        ][0]{
          _id,
          _type,
          title,
          description
        }
      `,
        {videoResourceId},
      )
      return result
    })

    // Generate SEO description using OpenAI
    const generatedDescription = await step.run(
      'Generate SEO description',
      async () => {
        const openai = new OpenAI({apiKey: openaiApiKey})

        // Use parent title if available, otherwise video title or generic
        const title =
          parentResource?.title || videoResource?.title || 'video content'
        const contentType = parentResource?._type || 'video'

        // Get the transcript text, limiting to avoid token limits
        const transcriptText = transcript.text.slice(0, 4000)

        const prompt = `You are an SEO expert for a web development educational platform. Generate a compelling meta description for a ${contentType} titled "${title}".

The transcript of the content is:
${transcriptText}${transcript.text.length > 4000 ? '...' : ''}

Requirements:
- Maximum 155 characters (this is a HARD limit - do not exceed)
- Include relevant technical keywords naturally
- Be compelling and encourage clicks from developers
- Describe the main value or takeaway
- Use active voice
- Do not use quotes or special formatting
- Do not start with "Learn" or "This tutorial"
- Focus on what the viewer will gain or accomplish

Return ONLY the description text, nothing else.`

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{role: 'user', content: prompt}],
          max_tokens: 100,
          temperature: 0.7,
        })

        const description =
          completion.choices[0]?.message?.content?.trim() || ''

        // Ensure it fits within 160 char limit (with some buffer)
        return description.slice(0, 160)
      },
    )

    if (!generatedDescription) {
      console.warn(
        `SEO Description: Failed to generate description for video ${videoResourceId}`,
      )
      return {
        skipped: true,
        reason: 'Failed to generate description',
        videoResourceId,
      }
    }

    // Always store the description on the videoResource
    await step.run('Store description on videoResource', async () => {
      return sanityWriteClient
        .patch(videoResourceId)
        .set({generatedDescription})
        .commit()
    })

    console.info(
      `SEO Description: Stored on video ${videoResourceId}: "${generatedDescription}"`,
    )

    // If parent exists and doesn't have a description, copy it there
    if (parentResource && !parentResource.description?.trim()) {
      await step.run('Copy description to parent resource', async () => {
        return sanityWriteClient
          .patch(parentResource._id)
          .set({description: generatedDescription})
          .commit()
      })

      console.info(
        `SEO Description: Copied to parent ${parentResource._id} (${parentResource._type})`,
      )

      // Emit success event
      await step.run('Emit description generated event', async () => {
        return inngest.send({
          name: SEO_DESCRIPTION_GENERATED,
          data: {
            resourceId: parentResource._id,
            description: generatedDescription,
          },
        })
      })

      return {
        success: true,
        videoResourceId,
        parentResourceId: parentResource._id,
        parentResourceType: parentResource._type,
        description: generatedDescription,
      }
    }

    return {
      success: true,
      videoResourceId,
      parentResourceId: null,
      description: generatedDescription,
      note: 'Description stored on video, no parent resource found to copy to',
    }
  },
)
