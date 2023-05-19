import cx from 'classnames'

type Props = {
  className?: string
  children: React.ReactNode
} & React.ComponentProps<'h1'>

export default function PageHeadline({
  className,
  children,
  ...restProps
}: Props) {
  return (
    <h1
      className={cx(
        'text-center font-heading text-4xl font-black sm:text-5xl lg:text-6xl',
        className,
      )}
      {...restProps}
    >
      {children}
    </h1>
  )
}
