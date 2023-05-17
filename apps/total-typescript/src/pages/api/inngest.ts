import {serve} from 'inngest/next'
import {convertkitSurveyAnswered, inngest} from '@skillrecordings/inngest'
import {ChatOpenAI} from 'langchain/chat_models'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'

import {ConversationChain} from 'langchain/chains'
import {commercePostPurchase} from '@skillrecordings/skill-api'

type SummaryInputEvent = {
  name: 'api/chat.submitted'
  data: {
    requestId: string
    input: string
  }
}
type Events = {
  'api/chat.submitted': SummaryInputEvent
}

const summarizeInput = inngest.createFunction(
  {name: 'Summarize chat and documents'},
  {event: 'api/chat.submitted'},
  async ({event, step}) => {
    const output = await step.run('Summarize input', async () => {
      const humanPrompt = `
  transcript: ${event.data.input}\n\n

  Outline the concepts in the transcript and create a mermaid diagram of them. Use markdown.
  `
      const prompt = ChatPromptTemplate.fromPromptMessages([
        SystemMessagePromptTemplate.fromTemplate(
          `You are a senior software developer, technical writer, and instructional designer 
      well versed in the 10 Steps to Complex Learning and Understanding by Design systems of instructional design. 
      You love designing concept maps and authentic performance tasks for learners to accomplish. 
      Whole task learning is accomplished via task classes, and you are always looking for a good real-world example 
      to suggest learners try on their own.

RULES:
- You will be provided a transcript. 
- Create three titles for the transcript
- Construct a heirarchical concept map for the text in the transcript.
-  include a Mermaid Diagram. do NOT leave out the mermaid diagram
- The mermaid diagram should flow from top to bottom in a concept hierarchy
- The mermaid should accurately describe the concepts and their relationships
- The mermaid diagram syntax should be cautious of syntax errors
- The concepts must be about the process described in the transcript and NOT the example the process is being applied to.
- Create a succinct concept focused summary of the transcript. Do not leave this out.
- As a separate Step Include an exercise that would help a learner practice the concepts described in the transcript
- DO NOT ATTEMPT TO SOLVE ANY CHALLENGES PRESENTED IN THE TRANSCRIPT. You are only to use concepts that are present in the text of the transcript.`.trim(),
        ),
        HumanMessagePromptTemplate.fromTemplate(humanPrompt),
      ])

      const llm = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo',
        openAIApiKey: process.env.OPENAI_API_KEY,
      })
      let chain = new ConversationChain({
        llm,
        prompt,
      })

      return await chain.call({text: event.data.input}).then((res) => {
        return res.response
      })
    })

    const title = await step.run('Generate a title', async () => {
      const prompt = ChatPromptTemplate.fromPromptMessages([
        SystemMessagePromptTemplate.fromTemplate(`You are a senior software developer, technical writer, and instructional designer 
      well versed in the 10 Steps to Complex Learning and Understanding by Design systems of instructional design. 
      You love designing concept maps and authentic performance tasks for learners to accomplish. 
      Whole task learning is accomplished via task classes, and you are always looking for a good real-world example 
      to suggest learners try on their own.  Given the following summary and concept map, generate a title
    which summarizes the report in under 100 characters. Do NOT dare wrap the title in quatation marks.`),
        HumanMessagePromptTemplate.fromTemplate(output),
      ])

      const llm = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo',
        openAIApiKey: process.env.OPENAI_API_KEY,
      })
      let chain = new ConversationChain({
        llm,
        prompt,
      })

      return await chain.call({text: output}).then((res) => {
        return res.response
      })
    })

    return {output, title}
  },
)

export default serve(inngest, [
  convertkitSurveyAnswered,
  summarizeInput,
  commercePostPurchase,
])
