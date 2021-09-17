import React, {InputHTMLAttributes, LabelHTMLAttributes} from 'react'

type InputOptions = {}

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  InputOptions & {
    name: string
    label: string
  }

const Label: React.FC<LabelHTMLAttributes<HTMLLabelElement>> = ({
  children,
  ...rest
}) => {
  return (
    <label data-sr-input-label {...rest}>
      {children}
    </label>
  )
}

const Input: React.FC<InputProps> = ({name, label, ...rest}) => {
  const {required} = rest

  return (
    <div data-sr-input-wrapper>
      <Label htmlFor={name}>
        {label}
        {required && (
          <abbr title="required" data-sr-input-asterisk>
            *
          </abbr>
        )}
      </Label>
      <input data-sr-input id={name} {...rest} />
    </div>
  )
}

export default Input
