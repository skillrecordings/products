import React from 'react'
import {useEditor, EditorContent} from '@tiptap/react'
import {CheckIcon} from '@heroicons/react/solid'
import {RadioGroup} from '@headlessui/react'
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
        class:
          'prose prose-sm min-h-[150px] max-h-[250px] overflow-y-auto shadow-sm bg-gray-100 p-3 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md',
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
    <div>
      <div className="flex w-full items-center justify-between">
        <label
          className="inline-block flex-shrink-0 pb-1 text-sm font-semibold"
          htmlFor="text"
        >
          {label} <span className="font-normal">(required)</span>
        </label>
        {errors.text && touched.text ? (
          <div
            aria-live="polite"
            className="inline-block pb-1 text-xs font-semibold leading-tight text-pink-600 sm:text-sm"
          >
            {errors.text}
          </div>
        ) : null}
      </div>
      <div
        className={cx({
          'rounded-md ring ring-pink-600 ring-opacity-20 ring-offset-1':
            errors.text && touched.text,
        })}
      >
        <EditorContent editor={editor} name="text" id="text" />
      </div>
      {showMarkdown && (
        <small className="text-gray-500">
          Styling with markdown is supported.
        </small>
      )}
    </div>
  )
}

export const EmotionField: React.FC<React.PropsWithChildren<any>> = (props) => {
  const [field] = useField({name: props.name})
  return (
    <div>
      <label
        className="inline-flex pb-1 text-sm font-semibold"
        htmlFor="context.emotion"
      >
        Emotion
      </label>
      <RadioGroup
        {...props}
        value={field.value}
        onChange={(value: string) => {
          field.onChange({target: {value, name: props.name}})
        }}
      >
        <RadioGroup.Label className="sr-only">Pick an emotion</RadioGroup.Label>
        <div className="flex items-center space-x-3">
          {[':heart_eyes:', ':wave:', ':sob:'].map((emotion) => (
            <RadioGroup.Option
              key={emotion}
              value={emotion}
              className={({active, checked}) =>
                `${
                  active
                    ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-300'
                    : ''
                }
              ${
                checked
                  ? 'bg-gray-200/50 bg-opacity-75 text-white shadow-inner'
                  : 'bg-white'
              }
                relative flex cursor-pointer rounded-lg border border-gray-200 px-4 py-3 transition focus:outline-none hover:bg-gray-100/50`
              }
            >
              {({checked}) => (
                <>
                  <RadioGroup.Label
                    className={`cursor-pointer text-xl font-medium ${
                      checked ? 'text-gray-900' : 'text-gray-900'
                    }`}
                    role="img"
                    aria-label={getEmoji(emotion).label}
                  >
                    {getEmoji(emotion).image}
                  </RadioGroup.Label>
                  {checked && (
                    <CheckIcon className="absolute right-1 bottom-1 h-4 w-4 text-gray-900" />
                  )}
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

export const CategoryField: React.FC<React.PropsWithChildren<any>> = (
  props,
) => {
  const [field] = useField({name: props.name})
  return (
    <div>
      <label
        className="inline-flex pb-1 text-sm font-semibold"
        htmlFor="context.emotion"
      >
        Category
      </label>
      <RadioGroup
        {...props}
        value={field.value}
        onChange={(value: string) => {
          field.onChange({target: {value, name: props.name}})
        }}
      >
        <RadioGroup.Label className="sr-only">Pick a category</RadioGroup.Label>
        <div className="flex items-center space-x-3">
          {['general', 'help'].map((category) => (
            <RadioGroup.Option
              key={category}
              value={category}
              className={({active, checked}) =>
                `${
                  active
                    ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-300'
                    : ''
                }
              ${
                checked
                  ? 'bg-gray-200/50 bg-opacity-75 text-white shadow-inner'
                  : 'bg-white'
              }
                relative flex cursor-pointer rounded-lg border border-gray-200 px-5 py-4 transition focus:outline-none hover:bg-gray-100/50`
              }
            >
              {({checked}) => (
                <>
                  <RadioGroup.Label
                    className={`cursor-pointer text-sm font-medium ${
                      checked ? 'text-gray-900' : 'text-gray-900'
                    }`}
                  >
                    {category}
                  </RadioGroup.Label>
                  {checked && (
                    <CheckIcon className="absolute right-1 bottom-1 h-4 w-4 text-gray-900" />
                  )}
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}
