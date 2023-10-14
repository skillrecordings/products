import {inngest} from 'inngest/inngest.server'
import {EMAIL_WRITING_REQUESTED_EVENT} from 'inngest/events'
import OpenAI from 'openai'

const openai = new OpenAI()

export const writeAnEmail = inngest.createFunction(
  {id: `write-an-email`, name: 'GPT-4 Email Writer'},
  {event: EMAIL_WRITING_REQUESTED_EVENT},
  async ({event, step}) => {
    const currentProgress = {
      nextLesson: event.data.moduleProgress.nextLesson,
      nextSection: event.data.moduleProgress.nextSection,
      lessonCount: event.data.moduleProgress.lessonCount,
      percentComplete: event.data.moduleProgress.percentComplete,
      moduleCompleted: event.data.moduleProgress.moduleCompleted,
    }

    const primarySystemWriterPrompt = `Craft transactional email subjects and bodies for the 
    "Epic Web" developer education course, specifically designed to improve retention, 
    engagement, and motivate learners towards their goals. These emails are part of a 
    post-purchase, automated sequence and are triggered upon the completion of either 
    the first lesson exercise or the last exercise in a workshop. The workshops are 
    video-based with interactive features, taking place in a local development environment. 
    Utilize provided JSON/JavaScript data to reference the learner's current progress, 
    specific lessons just completed, and upcoming lessons, as well as which workshop 
    the lesson is part of. Include a section in each email to highlight the learner's 
    progress and engagement levels. Maintain a friendly and encouraging tone, 
    and optimize for clarity and actionability. Don't be overly enthusiastic. It needs to be authentic and professional.
    
    Learner name: ${event.user.name}
    
    current module slug: ${event.data.currentModuleSlug}
    
    current lesson slug: ${event.data.currentLessonSlug}
    
    current section slug: ${event.data.currentSectionSlug}
    
    module progress: ${JSON.stringify(currentProgress)}
    
    ${
      currentProgress.nextLesson
        ? `next lesson slug: ${currentProgress.nextLesson.slug}`
        : ''
    }
    
    ${
      currentProgress.nextSection
        ? `next section slug: ${currentProgress.nextSection.slug}`
        : ''
    }

    module link: ${process.env.NEXTAUTH_URL}/workshops/${
      event.data.currentModuleSlug
    }
    
    Additional context: ${event.data.additionalContext}
    
    ${
      event.data.previousDraft
        ? `Previous draft: ${event.data.previousDraft}`
        : ''
    }
    ${
      event.data.editorComments
        ? `Editor comments: ${event.data.editorComments}`
        : ''
    }
    
    Response Format: You should respond with a JSON object that has subject and body properties like this {"subject": "The subject line for the email", body:"The markdown for the body of the email"}. 
    The body should be in markdown format. The subject should be plain text.
    
    Instructions: . No additional text or commentary is necessary. If you are provided Previous Draft or Editor Comments, please use
    them as a basis for the email and subject that you write. 

    `

    const aiResponse = await step.run(
      'send to writer for first draft',
      async () => {
        return await openai.chat.completions.create({
          messages: [{role: 'user', content: primarySystemWriterPrompt}],
          model: 'gpt-4',
        })
      },
    )
    const editorPrompt = `The following is a draft of an email that was written by an AI. Please review it and make any necessary changes.
        and consider the original prompt and any previous drafts or editor comments. Do not rewrite the email.
        
        as an editor, your job is to provide suggestions that will be applied to the next draft.
        
        - be stern and professional
        - be clear and concise
        - don't hold back on criticism
        - the audience is professional web developers, so don't be corny or pandering
    `
    const aiEditorResponse = await step.run(
      'send to editor for suggestions',
      async () => {
        return await openai.chat.completions.create({
          messages: [
            {role: 'user', content: primarySystemWriterPrompt},
            {role: 'assistant', content: aiResponse.choices[0].message.content},
            {role: 'user', content: editorPrompt},
          ],
          model: 'gpt-4',
        })
      },
    )

    const aiFinalResponse = await step.run(
      'send to writer for final draft',
      async () => {
        return await openai.chat.completions.create({
          messages: [
            {role: 'user', content: primarySystemWriterPrompt},
            {role: 'assistant', content: aiResponse.choices[0].message.content},
            {role: 'user', content: editorPrompt},
            {
              role: 'assistant',
              content: aiEditorResponse.choices[0].message.content,
            },
            {role: 'user', content: primarySystemWriterPrompt},
          ],
          model: 'gpt-4',
        })
      },
    )

    const formatCheck = await step.run(
      'check and format the json',
      async () => {
        return await openai.chat.completions.create({
          messages: [
            {
              role: 'user',
              content: `Please check the following JSON and correct any errors in the structure so it will parse with JSON.parse. don't explain it please, just return the corrected json and only the corrected json ready to be parsed. use newline character for long strings that need to be a single line but do not escape the newline character.
        
        ${aiFinalResponse.choices[0].message.content}`,
            },
          ],
          model: 'gpt-4',
        })
      },
    )

    return JSON.parse(formatCheck.choices[0].message.content || '{}')
  },
)
