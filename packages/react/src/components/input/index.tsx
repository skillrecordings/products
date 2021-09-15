import React, {InputHTMLAttributes, LabelHTMLAttributes} from 'react'

interface InputOptions {}

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    InputOptions {
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
        {required && <span data-sr-input-asterisk>*</span>}
      </Label>
      <input data-sr-input id={name} {...rest} />
    </div>
  )
}

export default Input
