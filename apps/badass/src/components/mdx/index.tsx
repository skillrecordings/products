import {title} from 'process'
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
  TweetEmbedDouble,
  TweetEmbedDoubleProps,
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
  CalloutTitle,
  CalloutTitleProps,
} from './components'

const mdxComponents = {
  BodyBlockquote: ({
    children,
    color,
    subtitle,
    image,
    imageWidth,
    imageHeight,
  }: React.PropsWithChildren<BodyBlockquoteProps>) => {
    return (
      <BodyBlockquote
        color={color}
        subtitle={subtitle}
        image={image}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
      >
        {children}
      </BodyBlockquote>
    )
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
  TweetEmbedDouble: ({tweetId_1, tweetId_2}: TweetEmbedDoubleProps) => {
    return <TweetEmbedDouble tweetId_1={tweetId_1} tweetId_2={tweetId_2} />
  },
  SkeletonHandSeparator: ({
    number,
    title,
    subtitle,
  }: SkeletonHandSeparatorProps) => {
    return (
      <SkeletonHandSeparator
        number={number}
        title={title}
        subtitle={subtitle}
      />
    )
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
  AccentedTitle: ({text, color}: AccentedTitleProps) => {
    return <AccentedTitle text={text} color={color} />
  },
  CalloutTitle: ({
    children,
    color,
  }: React.PropsWithChildren<CalloutTitleProps>) => {
    return <CalloutTitle color={color}>{children}</CalloutTitle>
  },
  TeamMembersBlock: ({
    description,
    title,
    name,
    portrait,
    portraitWidth,
    portraitHeight,
    multiple,
    reducedBottomMargin,
    reducedTopMargin,
  }: TeamMembersBlockProps) => {
    return (
      <TeamMembersBlock
        description={description}
        title={title}
        name={name}
        portrait={portrait}
        portraitWidth={portraitWidth}
        portraitHeight={portraitHeight}
        multiple={multiple}
        reducedBottomMargin={reducedBottomMargin}
        reducedTopMargin={reducedTopMargin}
      />
    )
  },
}

export default mdxComponents
