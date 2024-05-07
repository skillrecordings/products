import React from 'react'
import {useEditor, EditorContent} from '@tiptap/react'
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
          'prose min-h-[150px] max-h-[250px] overflow-y-auto border-er-gray-200 bg-background p-3 focus:ring-indigo-500 block w-full border rounded-md',
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
          className="inline-block flex-shrink-0 pb-1 text-xs font-semibold md:text-base"
          htmlFor="text"
        >
          {label}{' '}
          <span className="font-normal text-er-gray-600">(required)</span>
        </label>
        {errors.text && touched.text ? (
          <div
            aria-live="polite"
            className="inline-block pb-1 text-xs font-medium leading-tight text-red-500 sm:text-sm"
          >
            {errors.text}
          </div>
        ) : null}
      </div>
      <div
        className={cx({
          'rounded-md': errors.text && touched.text,
        })}
      >
        <EditorContent editor={editor} name="text" id="text" />
      </div>
      {showMarkdown && (
        <small className="block pt-2 text-sm text-gray-400">
          Styling with markdown is supported.
        </small>
      )}
    </div>
  )
}

export const EmotionField: React.FC<React.PropsWithChildren<any>> = (props) => {
  const [field] = useField({name: props.name})
  return (
    <div className="flex items-center justify-center space-x-4">
      <label
        className="inline-flex pb-1 text-base font-semibold"
        htmlFor="context.emotion"
      >
        Pick an emoji
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
                  checked
                    ? 'border-er-gray-400 bg-er-gray-300 text-white hover:bg-er-gray-200'
                    : 'bg-background hover:bg-er-gray-200'
                }
                relative flex cursor-pointer rounded-full border border-er-gray-200 px-4 py-3 transition focus:outline-none`
              }
            >
              {({checked}) => (
                <>
                  <RadioGroup.Label
                    className={`cursor-pointer text-xl font-medium ${
                      checked ? 'text-gray-300' : 'text-gray-300'
                    }`}
                    role="img"
                    aria-label={getEmoji(emotion).label}
                  >
                    {getEmoji(emotion).image}
                  </RadioGroup.Label>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}
