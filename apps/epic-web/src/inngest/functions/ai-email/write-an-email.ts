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

    const primarySystemWriterPrompt = `You are Kody the Koala, a friendly mascot 
    for the professional courses from Epic Web tat always signs off with the emoji 🐨
    with his signature at the end of the email.
    
    Your job is to write email subjects and bodies for the 
    "Epic Web" developer education course, 
    
    The emails are intended to improve retention, 
    engagement, and motivate learners towards their goals. These emails are part of a 
    post-purchase, onboarding sequence and are triggered upon the completion of either 
    the first lesson exercise or the last exercise in a workshop. The workshops are 
    video-based with interactive features, taking place in a local development environment. 
    Utilize provided JSON/JavaScript data to reference the learner's current progress, 
    specific lessons just completed, and upcoming lessons, as well as which workshop 
    the lesson is part of. Include a section in each email to highlight the learner's 
    progress and engagement levels. Maintain a friendly and encouraging tone, 
    and optimize for clarity and actionability. 
    
    - Don't be overly enthusiastic. 
    - be authentic and professional. 
    - don't use several exclamation points or emojis. 
    - The audience is professional web developers, so don't be corny or pandering.
    - let the learners hard work speak for itself. 
    - less is more.
    - don't be repetitive
    - if there is any previous commentary from the editor, please use it as a basis to improve the email and subject that you write.
    - prefer full text titles over slugs
    - don't guess at titles, use the provided data only
    - don't talk about the next lesson or module, only the current one
    - keep the exposition to a minimum
    - developers hate when ai writes for them, don't sound like an ai, sound human
    - when it makes sense, don't focus on Remix, focus on the broader universal skills of a web developer

    some metadata:
    - Learner name: ${event.user.name}
    - current lesson title: ${event.data.currentLesson.title}
    - current lesson description: ${event.data.currentLesson.description}
    - current module title: ${event.data.currentLesson.module.title}
    - current module description: ${event.data.currentLesson.module.description}
    - current module slug: ${event.data.currentModuleSlug}
    - current lesson slug: ${event.data.currentLessonSlug}
    - current section slug: ${event.data.currentSectionSlug}
    - module progress: ${JSON.stringify(currentProgress)}
    ${
      currentProgress.nextLesson
        ? `- next lesson slug: ${currentProgress.nextLesson.slug}`
        : ''
    }
    ${
      currentProgress.nextSection
        ? `- next section slug: ${currentProgress.nextSection.slug}`
        : ''
    }
    - {moduleLink}: ${process.env.NEXTAUTH_URL}/workshops/${
      event.data.currentModuleSlug
    }
    - Additional context: ${event.data.additionalContext}
    - ${
      event.data.previousDraft
        ? `Previous draft: ${event.data.previousDraft}`
        : ''
    }
    - ${
      event.data.editorComments
        ? `Editor comments: ${event.data.editorComments}`
        : ''
    }
    
    Response Format: You should respond with a JSON object that has subject 
    and body properties like this {"subject": "The subject line for the email", 
    body:"The markdown for the body of the email"}. 
    The body should be in markdown format. The subject should be plain text.
    
    Instructions: . No additional text or commentary is necessary. 
    If you are provided Previous Draft or Editor Comments, please use
    them as a basis for the email and subject that you write.
    
    - do not link to lessons, only the module using moduleLink from above
    - do not guess lesson or module titles, use the provided data only
    - keep the exposition to a minimum

    `

    const aiResponse = await step.run(
      'send to writer for first draft',
      async () => {
        return await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `Epic Web Dev, taught by Kent C. Dodds, 
    offers a comprehensive journey through full-stack development, emphasizing hands-on 
    learning to build sustainable user experiences. It hosts modules like Full Stack Foundations, 
    Professional Web Forms, Data Modeling Deep Dive, Web Authentication, and Full Stack Testing, 
    each meticulously crafted for skill enhancement. Unlike passive learning, participants engage 
    with a bespoke local web app, melding with their local dev setups for real-time code execution 
    and testing.`,
            },
            {role: 'user', content: primarySystemWriterPrompt},
          ],
          model: 'gpt-4',
        })
      },
    )
    const editorPrompt = `The following is a draft of an email that was written 
    by an AI. Please review it and make any necessary changes.
        and consider the original prompt and any previous drafts or editor
         comments. Do not rewrite the email.
        
        as an editor, your job is to provide suggestions that will be 
        applied to the next draft.
        
        - be professional
        - remember that developers HATE robots
        - don't hold back on criticism
        - the audience is professional web developers, so don't be corny or pandering
        - watch out for repetitiveness
        - watch out for ai jank and hallucinations
    `
    const aiEditorResponse = await step.run(
      'send to editor for suggestions',
      async () => {
        return await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `Epic Web Dev, taught by Kent C. Dodds, 
    offers a comprehensive journey through full-stack development, emphasizing hands-on 
    learning to build sustainable user experiences. It hosts modules like Full Stack Foundations, 
    Professional Web Forms, Data Modeling Deep Dive, Web Authentication, and Full Stack Testing, 
    each meticulously crafted for skill enhancement. Unlike passive learning, participants engage 
    with a bespoke local web app, melding with their local dev setups for real-time code execution 
    and testing.`,
            },
            {role: 'user', content: primarySystemWriterPrompt},
            {role: 'assistant', content: aiResponse.choices[0].message.content},
            {role: 'user', content: editorPrompt},
          ],
          model: 'gpt-4',
        })
      },
    )

    const aiWriterRevisionsPrompt = `
    take the suggestions to heart and make a best effort to revise the subject and email
    into something useful. don't explain it please, just return the revised subject and email 
    in the same json format as before. use newline character for long strings that need to be
    a single line but do not escape the newline character. prefer full text titles over slugs
    `

    const aiFinalResponse = await step.run(
      'send to writer for another draft',
      async () => {
        return await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `Epic Web Dev, taught by Kent C. Dodds, 
    offers a comprehensive journey through full-stack development, emphasizing hands-on 
    learning to build sustainable user experiences. It hosts modules like Full Stack Foundations, 
    Professional Web Forms, Data Modeling Deep Dive, Web Authentication, and Full Stack Testing, 
    each meticulously crafted for skill enhancement. Unlike passive learning, participants engage 
    with a bespoke local web app, melding with their local dev setups for real-time code execution 
    and testing.`,
            },
            {role: 'user', content: primarySystemWriterPrompt},
            {role: 'assistant', content: aiResponse.choices[0].message.content},
            {role: 'user', content: editorPrompt},
            {
              role: 'assistant',
              content: aiEditorResponse.choices[0].message.content,
            },
            {role: 'user', content: aiWriterRevisionsPrompt},
          ],
          model: 'gpt-4',
        })
      },
    )
    const bossEditorPrompt = `
    you are the Editor in Chief and you won't accept anything less than perfection.
    give the writer the business and make sure that this subject and email are great
    without cruft or repetition. don't explain it please, just return your version of 
    the subject and email in the same json format as before. use newline character for
    long strings that need to be a single line but do not escape the newline character.
    
    - remove any links that contain undefined.
    - LESS IS MORE. When in doubt: cut it out.
    - keep it authentic and conversational
    - do developers like AI writing at them? No. Remember that.
    - remove any emojis from the subject
    `
    const aiBossEditorResponse = await step.run(
      'send to boss editor for suggestions',
      async () => {
        return await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `Epic Web Dev, taught by Kent C. Dodds, 
    offers a comprehensive journey through full-stack development, emphasizing hands-on 
    learning to build sustainable user experiences. It hosts modules like Full Stack Foundations, 
    Professional Web Forms, Data Modeling Deep Dive, Web Authentication, and Full Stack Testing, 
    each meticulously crafted for skill enhancement. Unlike passive learning, participants engage 
    with a bespoke local web app, melding with their local dev setups for real-time code execution 
    and testing.`,
            },
            {role: 'user', content: primarySystemWriterPrompt},
            {role: 'assistant', content: aiResponse.choices[0].message.content},
            {role: 'user', content: editorPrompt},
            {
              role: 'assistant',
              content: aiEditorResponse.choices[0].message.content,
            },
            {role: 'user', content: aiWriterRevisionsPrompt},
            {
              role: 'assistant',
              content: aiFinalResponse.choices[0].message.content,
            },
            {role: 'user', content: bossEditorPrompt},
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
              content: `Please check the following JSON and correct any errors 
              in the structure so it will parse with JSON.parse. don't 
              explain it please, just return the corrected json and only 
              the corrected json ready to be parsed. use newline character 
              for long strings that need to be a single line but do not escape 
              the newline character.
        
        ${aiBossEditorResponse.choices[0].message.content}`,
            },
          ],
          model: 'gpt-4',
        })
      },
    )

    return JSON.parse(formatCheck.choices[0].message.content || '{}')
  },
)
