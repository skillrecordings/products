export type TocItemProps = {
  title: string
  anchor: string
}

const Toc: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <div data-toc="" className="not-prose">
      <h3 data-toc-title>Table of contents</h3>
      <ol data-toc-items-list="">{children}</ol>
    </div>
  )
}

const TocItem: React.FC<TocItemProps> = ({title, anchor}) => {
  return (
    <li data-toc-item="">
      <a href={anchor}>
        <span>{title}</span>
      </a>
    </li>
  )
}

export {TocItem}

export default Toc
