export type BodyBlockquoteProps = {
  color: 'blue' | 'green' | 'red' | 'pink' | 'yellow'
  subtitle?: string
}

const BodyBlockquote: React.FC<
  React.PropsWithChildren<BodyBlockquoteProps>
> = ({children, color, subtitle}) => {
  return (
    <div
      data-body-blockquote=""
      data-body-blockquote-color={color}
      className="not-prose"
    >
      <blockquote className="pl-6 py-4 italic text-neutral-200">
        {children}
        {subtitle && (
          <span className="block mt-10 text-badass-gray-300">{subtitle}</span>
        )}
      </blockquote>
    </div>
  )
}

export default BodyBlockquote
