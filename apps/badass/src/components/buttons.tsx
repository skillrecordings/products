import * as React from 'react'
import Link from 'next/link'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'

type ButtonProps = {
  tag?: 'link' | 'button'
  href?: string
  fluid?: boolean
  disabled?: boolean
  className?: string
}

const commonStyles =
  'inline-flex self-center justify-center items-center rounded-xl focus-visible:ring-2 focus-visible:ring-badass-blue focus-visible:ring-offset-4 focus-visible:ring-offset-black focus-visible:outline-none duration-150 font-sans'

const commonPrimaryStyles =
  'h-[4.5rem] px-6 text-xl font-bold bg-badass-pink-600 hover:bg-badass-pink-800 disabled:bg-badass-pink-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:text-black'

const commonSecondaryStyles =
  'border border-neutral-200 hover:border-badass-green-500 bg-transparent hover:bg-badass-green-500 text-white hover:text-black disabled:opacity-40 disabled:cursor-not-allowed disabled:text-white disabled:hover:bg-transparent  disabled:hover:border-neutral-200'

const ButtonPrimary: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  tag = 'link',
  href,
  fluid,
  disabled,
  className = '',
  children,
}) => {
  const conditionalStyles = {
    'w-full': fluid,
    'min-w-[434px]': !fluid,
  }
  return tag === 'link' && href ? (
    <Link
      href={href}
      className={twMerge(
        cx(commonStyles, commonPrimaryStyles, conditionalStyles),
        className,
      )}
    >
      {children}
    </Link>
  ) : (
    <button
      disabled={disabled}
      className={twMerge(
        cx(commonStyles, commonPrimaryStyles, conditionalStyles),
        className,
      )}
    >
      {children}
    </button>
  )
}

const ButtonSecondary: React.FC<
  React.PropsWithChildren<ButtonProps & {size?: 'default' | 'middle' | 'small'}>
> = ({tag = 'link', href, fluid, disabled, size, className = '', children}) => {
  const conditionalStyles = {
    'w-full': fluid,
    'min-w-[434px]': (!fluid && size === 'default') || (!fluid && !size),
    'h-[4.5rem] text-xl font-bold px-6': size === 'default' || !size,
    'h-[2.25rem] text-sm font-medium px-4 md:h-[3.25rem] md:text-base md:font-medium md:px-6':
      size === 'middle',
    'h-[2.25rem] text-sm font-medium px-4': size === 'small',
  }
  return tag === 'link' && href ? (
    <Link
      href={href}
      className={twMerge(
        cx(commonStyles, commonSecondaryStyles, conditionalStyles),
        className,
      )}
    >
      {children}
    </Link>
  ) : (
    <button
      disabled={disabled}
      className={twMerge(
        cx(commonStyles, commonSecondaryStyles, conditionalStyles),
        className,
      )}
    >
      {children}
    </button>
  )
}

export {ButtonPrimary, ButtonSecondary}
