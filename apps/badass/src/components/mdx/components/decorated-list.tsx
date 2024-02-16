export type DecoratedListProps = {
  color: 'yellow' | 'blue'
  type: 'flash' | 'something'
  reducedSpacing?: boolean
}

const DecoratedList: React.FC<React.PropsWithChildren<DecoratedListProps>> = ({
  children,
  color,
  type,
  reducedSpacing = false,
}) => {
  return (
    <ul
      data-decorated-list=""
      data-decorated-list-color={color}
      data-decorated-list-type={type}
      data-reduced-spacing={reducedSpacing}
      className="not-prose"
    >
      {children}
    </ul>
  )
}

export default DecoratedList
