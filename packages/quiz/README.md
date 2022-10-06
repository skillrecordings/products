## Overview

The `quiz` package lets us add quiz questions to email sequences by linking to the questions from the ends of emails and then triggering the addition of specific tags in ConvertKit.

Each of those tags can then be set up in ConvertKit to trigger the next email in the sequence. (Or anything else tags can do in ConvertKit.) This creates a better learning experience because it only sends the next email at the point someone is ready for it rather than just sending one after another regardless of whether they're ready for it.

When using the quiz questions in emails, it's important to configure ConvertKit to automatically add the `ck_subscriber_id` query string value to all links in the emails. That's how the tags are tied back to the relevant subscriber.

The Process for setting up quiz questions and connecting them in ConvertKit is [currently a work-in-progress and lives in Roam](https://roamresearch.com/#/app/egghead/page/GepByGFy4). It goes into_more details of how to set up the quiz questions and answers and how to wire everything up.

## Quiz Configuration

The top-level quiz configuration can be be found in [src/config.ts](https://github.com/skillrecordings/products/blob/main/packages/quiz/src/config.ts). It controls the product title, author, and the 'after completion messages'. The defaults are generally good, but these can be customized for individual partner products if we need to adjust the tone/voice of the messaging.

## Question & Answer Configuration

### Three Types

- **1.** `essay` will present a `textarea` for the learner to type a response
- **2a.** `multiple-choice` with one correct answer will present the options as radio buttons
- **2b.** `multiple-choice` with more than one correct answer will present the options as checkboxes

You can view complete examples below, but here's a quick overview of how it all works. The `QuestionSet` is JSON where each key represents one question. That key is then used in the URL to determine which question is displayed.

ex. `example.com/answer?question=<key>`

The questions have the following attributes to determine how they work:

- `question` - The content of the question that's displayed to the learner
- `type` - One of either `essay` for a textarea-based response or `multiple-choice` for either radio-button-based or checkbox-based responses
- `tagId` - The ConvertKit Tag ID value. ConvertKit doesn't expose it in the UI, but if you navigate to a specific Tag from the "Subscribers" area, the Tag ID will be in the URL.

If the `type` is `multiple-choice`, these additional options determine how the answers are configured and handled.
- `correct` - A single string or array of string values representing which of the options in the `choices` section represent correct answers. If a single string is provided, the UI will use radio buttons for the chioces. If multiple correct answers are provided, the UI will use checkboxes.
- `answer` - A string to provide a summarized explanation of the correct answer.
- `choices` - An array of JSON values with `answer` and `label`
  + `answer` - The unique string identifier for the answer. This is the key for identifying which choices are the "correct" answers using the `correct` key above.
  + `label` - The text to display as an option in the multiple-choice setup

## Generating Links

You can link to specifi questions using the following URL format:

```
<Product Domain>/answer?question=<key>
```
Replace `<Product Domain>` with the partner product domain and `<key>` with the relevant `QuestionSet` key for the question.

## Process

For more details on the larger process and context of how to set up quiz questions for partner products, you can use the [Set Up Quiz Questions and Answers](https://roamresearch.com/#/app/egghead/page/GepByGFy4) block in Roam.

### Examples

**Basic**

```jsx
import {useQuestion, questionToShow} from '@skillrecordings/quiz'
import {QuestionResource} from '@skillrecordings/types'

const currentQuestion: QuestionResource = {
  question: 'Lorem ipsum dolor sit amet?',
  type: 'essay',
}

const question = useQuestion({
  currentQuestion: currentQuestion,
})

return questionToShow(question)
```

**Question set**

```jsx
import {useQuestion, questionToShow, getConfig} from '@skillrecordings/quiz'
import {QuestionSet} from '@skillrecordings/types'

const questionSet: QuestionSet = {
  welcome: {
    question: `Lorem ipsum dolor sit amet?`,
    type: `essay`,
    tagId: 1234567,
  },
  exercise: {
    question: `Lorem ipsum dlor sit amet?`,
    type: `multiple-choice`,
    tagId: 1234567,
    correct: 'yes',
    answer: `Lorem ipsum dolor sit amet.`,
    choices: [
      {
        answer: 'yes',
        label: 'Yes',
      },
      {
        answer: 'no',
        label: 'No',
      },
    ],
  },
}

const currentQuestion = get(questionSet, 'welcome')

const question = useQuestion({
  currentQuestion: currentQuestion,
  questionSet,
  config: getConfig('Product Title', 'Joe Doe'),
})

return questionToShow(question)
```

**Answer programmatically**

```jsx
const question = useQuestion({
  currentQuestion,
  currentAnswer: 'true',
})
```

### Styles

**Import default styles**

```css
@import '@skillrecordings/quiz/dist/styles/index.css';
```
