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
  IntroduceCard,
  IntroduceCardProps,
  LaunchResults,
  LaunchResultsProps,
  ImageWithCaption,
  ImageWithCaptionProps,
  AccentedTitle,
  AccentedTitleProps,
  TeamMembersBlock,
  TeamMembersBlockProps,
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
  ImageWithCaption: ({
    src,
    width,
    height,
    alt,
    captionTitle,
    captionSubtitle,
  }: ImageWithCaptionProps) => {
    return (
      <ImageWithCaption
        src={src}
        width={width}
        height={height}
        alt={alt}
        captionTitle={captionTitle}
        captionSubtitle={captionSubtitle}
      />
    )
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
  IntroduceCard: ({image, name, title}: IntroduceCardProps) => {
    return <IntroduceCard image={image} name={name} title={title} />
  },
  LaunchResults: ({
    firstDay,
    firstWeek,
    firstFourMonths,
  }: LaunchResultsProps) => {
    return (
      <LaunchResults
        firstDay={firstDay}
        firstWeek={firstWeek}
        firstFourMonths={firstFourMonths}
      />
    )
  },
  AccentedTitle: ({title}: AccentedTitleProps) => {
    return <AccentedTitle title={title} />
  },
  TeamMembersBlock: ({description, members, title}: TeamMembersBlockProps) => {
    return (
      <TeamMembersBlock
        description={description}
        members={members}
        title={title}
      />
    )
  },
}

export default mdxComponents
