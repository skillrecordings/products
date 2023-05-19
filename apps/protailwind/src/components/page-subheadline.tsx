import cx from 'classnames'

type Props = {
  className?: string
  children: React.ReactNode
} & React.ComponentProps<'p'>

export default function PageSubheadline({
  className,
  children,
  ...restProps
}: Props) {
  return (
    <p
      className={cx(
        'max-w-md pt-8 text-center text-lg text-brand-red lg:text-xl',
        className,
      )}
      {...restProps}
    >
      {children}
    </p>
  )
}
