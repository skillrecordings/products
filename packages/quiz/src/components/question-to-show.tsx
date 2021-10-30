import * as React from 'react'
import MultipleImageChoice from './question/multiple-image-choice'
import MultipleChoice from './question/multiple-choice'
import {QuestionProps} from './question'
import Essay from './question/essay'
import Code from './question/code'

export default function questionToShow(question: QuestionProps) {
  if (!question.currentQuestion) return

  switch (question.currentQuestion.type) {
    case 'essay': {
      return <Essay question={question} />
    }
    case 'code': {
      return <Code question={question} />
    }
    case 'multiple-choice': {
      return <MultipleChoice question={question} />
    }
    case 'multiple-image-choice': {
      return <MultipleImageChoice question={question} />
    }
    default:
      return 'error: unexpected question type'
  }
}
