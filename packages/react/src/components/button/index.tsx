import React, {Attributes, ButtonHTMLAttributes, PropsWithChildren} from 'react'
import Spinner from '../spinner'

type ButtonOptions = {
  /**
   * If `true`, the button will show a spinner.
   */
  isLoading?: boolean
  /**
   * If `true`, the button will be disabled.
   */
  disabled?: boolean
  /**
   * If added, the button will show an icon before the button's label.
   * @type React.ReactElement
   */
  leftIcon?: React.ReactElement
  /**
   * If added, the button will show an icon after the button's label.
   * @type React.ReactElement
   */
  rightIcon?: React.ReactElement
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonOptions & {}

type ButtonContentProps = Pick<
  ButtonProps,
  'leftIcon' | 'rightIcon' | 'children'
>

const ButtonContent: React.FC<React.PropsWithChildren<ButtonContentProps>> = (
  props,
) => {
  const {leftIcon, rightIcon, children} = props
  return (
    <>
      {leftIcon && <ButtonIcon>{leftIcon}</ButtonIcon>}
      {children}
      {rightIcon && <ButtonIcon>{rightIcon}</ButtonIcon>}
    </>
  )
}

const ButtonIcon: React.FC<
  React.PropsWithChildren<JSX.IntrinsicElements['span']>
> = (props) => {
  const {children, ...rest} = props

  const _children = React.isValidElement(children)
    ? React.cloneElement(children, {
        'aria-hidden': true,
        focusable: false,
      } as Partial<HTMLSpanElement> & Attributes)
    : children

  return (
    <span data-sr-button-icon {...rest}>
      {_children}
    </span>
  )
}

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  isLoading,
  leftIcon,
  rightIcon,
  disabled,
  ...rest
}) => {
  const contentProps = {rightIcon, leftIcon, children}

  return (
    <button data-sr-button {...rest} disabled={isLoading || disabled}>
      {isLoading ? (
        <>
          <ButtonIcon>
            <Spinner />
          </ButtonIcon>
          <span className="sr-only">Loading</span>
        </>
      ) : (
        <ButtonContent {...contentProps} />
      )}
    </button>
  )
}

export default Button
