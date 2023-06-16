import {
  BodyBlockquote,
  BodyBlockquoteProps,
  BodyImage,
  BodyImageProps,
  RelatedTeamMembers,
  TeamMemberCard,
  TeamMemberCardProps,
  TweetEmbed,
  TweetEmbedProps,
  SkeletonHandSeparator,
  SkeletonHandSeparatorProps,
} from './components'

const mdxComponents = {
  BodyBlockquote: ({
    children,
    color,
  }: React.PropsWithChildren<BodyBlockquoteProps>) => {
    return <BodyBlockquote color={color}>{children}</BodyBlockquote>
  },
  BodyImage: ({src, width, height, alt}: BodyImageProps) => {
    return <BodyImage src={src} width={width} height={height} alt={alt} />
  },
  TeamMemberCard: ({imageUrl, name, title}: TeamMemberCardProps) => {
    return <TeamMemberCard imageUrl={imageUrl} name={name} title={title} />
  },
  RelatedTeamMembers: ({children}: React.PropsWithChildren) => {
    return <RelatedTeamMembers>{children}</RelatedTeamMembers>
  },
  TweetEmbed: ({tweetId}: TweetEmbedProps) => {
    return <TweetEmbed tweetId={tweetId} />
  },
  SkeletonHandSeparator: ({number}: SkeletonHandSeparatorProps) => {
    return <SkeletonHandSeparator number={number} />
  },
}

export default mdxComponents
