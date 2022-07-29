import React, {InputHTMLAttributes, LabelHTMLAttributes} from 'react'

type InputOptions = {}

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  InputOptions & {
    name: string
    label: string
  }

const Label: React.FC<
  React.PropsWithChildren<LabelHTMLAttributes<HTMLLabelElement>>
> = ({children, ...rest}) => {
  return (
    <label data-sr-input-label {...rest}>
      {children}
    </label>
  )
}

const Input: React.FC<React.PropsWithChildren<InputProps>> = ({
  name,
  label,
  id,
  ...rest
}) => {
  const {required} = rest

  return (
    <div data-sr-input-wrapper>
      <Label htmlFor={id}>
        {label}
        {required && (
          <abbr title="required" data-sr-input-asterisk>
            *
          </abbr>
        )}
      </Label>
      <input data-sr-input name={name} id={id} {...rest} />
    </div>
  )
}

export default Input
