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
          'prose min-h-[150px] max-h-[250px] overflow-y-auto bg-input p-3 focus:ring-ring block w-full border border-border rounded-md dark:text-white',
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
          className="inline-block flex-shrink-0 pb-1 font-semibold"
          htmlFor="text"
        >
          {label} <span className="font-normal opacity-50">(required)</span>
        </label>
        {errors.text && touched.text ? (
          <div
            aria-live="polite"
            className="text-text inline-block pb-1 text-xs font-medium leading-tight opacity-50 sm:text-sm"
          >
            {errors.text}
          </div>
        ) : null}
      </div>
      <div
        className={cx({
          'rounded-md ring ring-pink-300 ring-opacity-80 ring-offset-background':
            errors.text && touched.text,
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
    <div>
      <label
        className="inline-flex pb-1 font-semibold"
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
                  active ? 'ring-2 ring-ring ring-opacity-60 ring-offset-2' : ''
                }
              ${
                checked
                  ? 'bg-input bg-opacity-75 text-secondary-foreground shadow-inner'
                  : 'bg-background'
              }
                relative flex cursor-pointer rounded-lg border border-border px-4 py-3 transition focus:outline-none`
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
                  {checked && (
                    <CheckIcon className="absolute bottom-1 right-1 h-4 w-4 text-gray-100" />
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

export const CategoryField: React.FC<
  React.PropsWithChildren<{
    name: string
    categories?: string[]
    id: string
  }>
> = ({name, categories = ['general', 'help', 'code'], id}, ...rest) => {
  const [field] = useField({name})
  return (
    <div>
      <label
        className="inline-flex pb-1 font-semibold"
        htmlFor="context.emotion"
      >
        Category
      </label>
      <RadioGroup
        {...rest}
        name={name}
        id={id}
        value={field.value}
        onChange={(value: string) => {
          field.onChange({target: {value, name: name}})
        }}
      >
        <RadioGroup.Label className="sr-only">Pick a category</RadioGroup.Label>
        <div className="flex items-center space-x-3">
          {categories.map((category) => (
            <RadioGroup.Option
              key={category}
              value={category}
              className={({active, checked}) =>
                `${
                  active ? 'ring-2 ring-ring ring-opacity-60 ring-offset-2' : ''
                }
              ${
                checked
                  ? 'bg-input bg-opacity-75 shadow-inner'
                  : 'bg-background'
              }
              text-text relative flex cursor-pointer rounded-lg border border-border px-4 py-3.5 transition focus:outline-none`
              }
            >
              {({checked}) => (
                <>
                  <RadioGroup.Label className={`cursor-pointer font-medium `}>
                    {category}
                  </RadioGroup.Label>
                  {checked && (
                    <CheckIcon className="absolute bottom-1 right-1 h-4 w-4 text-gray-100" />
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
