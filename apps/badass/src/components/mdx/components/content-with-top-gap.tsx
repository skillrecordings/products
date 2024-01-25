export type ContentWithTopGapProps = {}

const ContentWithTopGap: React.FC<
  React.PropsWithChildren<ContentWithTopGapProps>
> = ({children}) => {
  return <div data-content-with-top-gap="">{children}</div>
}

export default ContentWithTopGap
