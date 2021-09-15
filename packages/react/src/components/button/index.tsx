import React, {ButtonHTMLAttributes} from 'react'
import Spinner from '../spinner'

interface ButtonOptions {
  /**
   * Default is `primary`. Style using `[data-sr-button='secondary']`.
   * @type 'primary' | 'secondary' | 'tertiary'
   */
  kind?: 'primary' | 'secondary' | 'tertiary'
  /**
   * If `true`, the button will show a spinner.
   */
  isLoading?: boolean
  /**
   * If `true`, the button will be disabled.
   */
  isDisabled?: boolean
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

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonOptions {}

type ButtonContentProps = Pick<
  ButtonProps,
  'leftIcon' | 'rightIcon' | 'children'
>

const ButtonContent: React.FC<ButtonContentProps> = (props) => {
  const {leftIcon, rightIcon, children} = props
  return (
    <>
      {leftIcon && <ButtonIcon>{leftIcon}</ButtonIcon>}
      {children}
      {rightIcon && <ButtonIcon>{rightIcon}</ButtonIcon>}
    </>
  )
}

const ButtonIcon: React.FC<any> = (props) => {
  const {children, ...rest} = props

  const _children = React.isValidElement(children)
    ? React.cloneElement(children, {
        'aria-hidden': true,
        focusable: false,
      } as any)
    : children

  return (
    <div data-sr-button-icon {...rest}>
      {_children}
    </div>
  )
}

const Button: React.FC<ButtonProps> = ({
  children,
  kind = 'primary',
  isLoading,
  isDisabled,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const contentProps = {rightIcon, leftIcon, children}

  return (
    <button
      data-sr-button={kind}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
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
