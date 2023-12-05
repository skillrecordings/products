import {inngest} from 'inngest/inngest.server'
import {
  EMAIL_WRITING_REQUEST_COMPLETED_EVENT,
  EMAIL_WRITING_REQUESTED_EVENT,
} from 'inngest/events'
import OpenAI from 'openai'
import singleline from 'singleline'

const openai = new OpenAI()

export const writeAnEmail = inngest.createFunction(
  {id: `write-an-email`, name: 'GPT-4 Email Writer'},
  {event: EMAIL_WRITING_REQUESTED_EVENT},
  async ({event, step}) => {
    const {
      moduleProgress: {
        nextLesson,
        nextSection,
        lessonCount,
        percentComplete,
        moduleCompleted,
        lessons,
      },
    } = event.data

    const currentProgress = {
      nextLesson,
      nextSection,
      lessonCount,
      percentComplete,
      moduleCompleted,
      incompleteLessons: lessons
        .filter((lesson) => {
          return !lesson.lessonCompleted
        })
        .map((lesson) => {
          return {
            title: lesson.title,
          }
        }),
    }

    const systemPrompt = `Epic Web Dev, taught by Kent C. Dodds, 
    offers a comprehensive journey through full-stack development, emphasizing hands-on 
    learning to build sustainable user experiences. It hosts workshops like Full Stack Foundations, 
    Professional Web Forms, Data Modeling Deep Dive, Web Authentication, and Full Stack Testing, 
    each meticulously crafted for skill enhancement. Unlike passive learning, participants engage 
    with a bespoke local web app, melding with their local dev setups for real-time code execution 
    and testing.`

    const primarySystemWriterPrompt = `You are Kody the Koala, a friendly mascot 
    for the professional courses from Epic Web that always signs off with the emoji 🐨
    with his signature at the end of the email.
    
    Task:
    Your job is to write email subjects and bodies for the "Epic Web" developer education course
    that are sent to learners after they complete a lesson.
    
    Motivation:
    The emails are intended to improve retention, engagement, and motivate learners towards their goals. 
    
    This email are part of a post-purchase, onboarding sequence and are triggered upon 
    the completion a lesson in a workshop. 
    
    The workshops are meant to be worked through in a local development environment which
    has integrated video learning as well as exercises for practicing the skills that are
    being taught.
    
    Important considerations:
    - Use the progress data
    - Highlight the learner's progress
    - Maintain a friendly and encouraging tone
    - optimize for clarity and actionability
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
    - if you talk about the next lesson make sure it comes after the current lesson
    - keep the exposition to a minimum
    - developers hate when ai writes for them, don't sound like an ai, sound human
    - when it makes sense, don't focus on Remix, focus on the broader universal skills of a web developer
    - No additional "meta" text or commentary is necessary. 
    - editor feedback is a priority unless you think it is wrong, then you can ignore it.
    - do not link to lessons
    - do not guess lesson or workshop titles, use the progress data below only
    - keep the exposition and flowery language to a minimum

    Structured Progress Data:
    ${JSON.stringify(currentProgress, null, 2)}
    
    Lesson Just Finished:
    - title: ${event.data.currentLesson.title}
    - description: ${event.data.currentLesson.description}
    
    Current Workshop:
    - title: ${event.data.currentLesson.module.title}
    - description: ${event.data.currentLesson.module.description}
    
    Learner name:
    ${event.user.name}
    
    Response Format: 
    - Respond with a JSON object that has subject and body properties like this 
    {"subject": "The subject line for the email", body:"The markdown for the body of the email"}. 
    - The body should be in properly formatted markdown. 
    - The subject should be plain text.
    `

    const aiResponse = await step.run(
      'send to writer for first draft',
      async () => {
        return openai.chat.completions.create({
          messages: [
            {role: 'system', content: singleline(systemPrompt)},
            {role: 'user', content: singleline(primarySystemWriterPrompt)},
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
        - if you see direct references to Remix, suggest changes to broader web development concepts
        - check the new line characters and make sure they use a single slash and not a double slash or more like this \n NOT like this \\n or this \\\n or this \\\\\n
    `
    const aiEditorResponse = await step.run(
      'send to editor for suggestions',
      async () => {
        return openai.chat.completions.create({
          messages: [
            {role: 'system', content: singleline(systemPrompt)},
            {role: 'user', content: singleline(primarySystemWriterPrompt)},
            {role: 'assistant', content: aiResponse.choices[0].message.content},
            {role: 'user', content: singleline(editorPrompt)},
          ],
          model: 'gpt-4',
        })
      },
    )

    const aiWriterRevisionsPrompt = `
    take the suggestions to heart and make a best effort to revise the subject and email
    into something useful. don't explain it please, just return the revised subject and email 
    in the same json format as before. use newline character for long strings that need to be
    a single line but do not escape the newline character. prefer full text titles over slugs.
    deliver the best email a koala could possibly imagine.
    `

    const aiFinalResponse = await step.run(
      'send to writer for another draft',
      async () => {
        return openai.chat.completions.create({
          messages: [
            {role: 'system', content: singleline(systemPrompt)},
            {role: 'user', content: singleline(primarySystemWriterPrompt)},
            {role: 'assistant', content: aiResponse.choices[0].message.content},
            {role: 'user', content: singleline(editorPrompt)},
            {
              role: 'assistant',
              content: aiEditorResponse.choices[0].message.content,
            },
            {role: 'user', content: singleline(aiWriterRevisionsPrompt)},
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
    - newlines in the body should be a single slash and not a double slash or more like this \n NOT like this \\n or this \\\n or this \\\\\n
    - LESS IS MORE. When in doubt: cut it out.
    - keep it authentic and conversational
    - do developers like AI writing at them? No. Remember that.
    - remove any emojis from the subject (they are fine in the signature)
    - remove any direct name references to the learner from the subject
    - make sure the body is properly formatted and structured markdown
    - make sure the email has soul
    `

    const fullPrompt = [
      {role: 'system', content: singleline(systemPrompt)},
      {role: 'user', content: singleline(primarySystemWriterPrompt)},
      {role: 'assistant', content: aiResponse.choices[0].message.content},
      {role: 'user', content: editorPrompt},
      {
        role: 'assistant',
        content: aiEditorResponse.choices[0].message.content,
      },
      {role: 'user', content: singleline(aiWriterRevisionsPrompt)},
      {
        role: 'assistant',
        content: aiFinalResponse.choices[0].message.content,
      },
      {role: 'user', content: singleline(bossEditorPrompt)},
    ]
    const aiBossEditorResponse = await step.run(
      'send to boss editor for suggestions',
      async () => {
        return openai.chat.completions.create({
          messages: fullPrompt as OpenAI.ChatCompletionMessage[],
          model: 'gpt-4',
        })
      },
    )

    const formatCheck = await step.run(
      'check and format the json',
      async () => {
        return openai.chat.completions.create({
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

    const emailData = JSON.parse(formatCheck.choices[0].message.content || '{}')

    await step.sendEvent('notify that writing is done', {
      name: EMAIL_WRITING_REQUEST_COMPLETED_EVENT,
      data: {
        lessonId: event.data.currentLesson._id,
        ...emailData,
        fullPrompt,
      },
      user: event.user,
    })

    return {emailData, fullPrompt}
  },
)
