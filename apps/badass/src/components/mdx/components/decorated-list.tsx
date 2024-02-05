export type DecoratedListProps = {
  color: 'yellow' | 'blue'
  type: 'flash' | 'something'
}

const DecoratedList: React.FC<React.PropsWithChildren<DecoratedListProps>> = ({
  children,
  color,
  type,
}) => {
  return (
    <ul
      data-decorated-list=""
      data-decorated-list-color={color}
      data-decorated-list-type={type}
      className="not-prose"
    >
      {children}
    </ul>
  )
}

export default DecoratedList
