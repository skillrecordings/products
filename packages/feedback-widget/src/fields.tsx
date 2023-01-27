import React from 'react'
import {useEditor, EditorContent} from '@tiptap/react'
import {CheckIcon} from '@heroicons/react/solid'
import * as RadioGroup from '@radix-ui/react-radio-group'
// import {RadioGroup} from '@headlessui/react'
import {useField} from 'formik'
import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import cx from 'classnames'
import {getEmoji} from '@skillrecordings/skill-api/dist/client'

export const FeedbackField: React.FC<React.PropsWithChildren<any>> = ({
  label = 'Your feedback',
  errors,
  touched,
  isSubmitted,
  showMarkdown = true,
}) => {
  const [field] = useField({name: 'text'})
  const editor = useEditor({
    extensions: [StarterKit, Highlight, Typography, Link],
    content: field.value,
    onUpdate: ({editor}) => {
      field.onChange({target: {value: editor.getHTML(), name: 'text'}})
    },
    onBlur: ({event}) => {
      field.onBlur(event)
    },
    editorProps: {
      attributes: {
        id: 'text',
        name: 'text',
      },
    },
  })
  const isEmpty = editor?.isEmpty

  React.useEffect(() => {
    if (isEmpty) {
      field.onChange({target: {value: '', name: 'text'}})
    }
    if (isSubmitted) {
      editor?.commands?.clearContent()
    }
  }, [isEmpty, isSubmitted])

  return (
    <div data-sr-feedback-widget-feedback-field="">
      <div data-sr-feedback-widget-feedback-field-header="">
        <label htmlFor="text">
          {label} <span>(required)</span>
        </label>
        {errors.text && touched.text ? (
          <div aria-live="polite">{errors.text}</div>
        ) : null}
      </div>
      <div
        data-sr-feedback-widget-feedback-field={
          errors.text && touched.text ? 'error' : ''
        }
      >
        <EditorContent editor={editor} name="text" id="text" />
      </div>
      {showMarkdown && <small>Styling with markdown is supported.</small>}
    </div>
  )
}

export const EmotionField: React.FC<React.PropsWithChildren<any>> = (props) => {
  const [field] = useField({name: props.name})
  return (
    <div data-sr-feedback-widget-emotion-field="">
      <label htmlFor="context.emotion">Emotion</label>
      <RadioGroup.Root
        {...props}
        loop
        data-sr-feedback-widget-emotion-field-buttons=""
        value={field.value}
        aria-label="Pick an emotion"
        onValueChange={(value) =>
          field.onChange({target: {value, name: props.name}})
        }
      >
        {[':heart_eyes:', ':wave:', ':sob:'].map((emotion) => (
          <>
            <RadioGroup.Item value={emotion} key={emotion}>
              {getEmoji(emotion).image}
              <RadioGroup.Indicator />
            </RadioGroup.Item>
          </>
        ))}
      </RadioGroup.Root>
    </div>
  )
}

export const CategoryField: React.FC<React.PropsWithChildren<any>> = (
  props,
) => {
  const [field] = useField({name: props.name})
  return (
    <div data-sr-feedback-widget-category-field="">
      <label htmlFor="context.emotion">Category</label>
      <RadioGroup.Root
        {...props}
        data-sr-feedback-widget-category-field-buttons=""
        value={field.value}
        aria-label="Pick a category"
        onValueChange={(value) =>
          field.onChange({target: {value, name: props.name}})
        }
        loop
      >
        {['general', 'help'].map((category) => (
          <>
            <RadioGroup.Item value={category} key={category} id="r1">
              <RadioGroup.Indicator />
              {category}
            </RadioGroup.Item>
          </>
        ))}
      </RadioGroup.Root>
    </div>
  )
}
