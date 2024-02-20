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
  AccentedSubtitle,
  AccentedSubtitleProps,
  TeamMembersBlock,
  TeamMembersBlockProps,
  CalloutTitle,
  CalloutTitleProps,
  Toc,
  TocItem,
  TocItemProps,
  ContentWithTopGap,
  ContentWithTopGapProps,
  EmbedVideo,
  EmbedVideoProps,
  DecoratedList,
  DecoratedListProps,
  FloatedImage,
  FloatedImageProps,
  FancyTitleWithSubtitle,
  FancyTitleWithSubtitleProps,
  FullTranscript,
  ResourcesLinks,
  ResourcesLinksProps,
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
  BodyImage: ({src, width, height, alt, caption}: BodyImageProps) => {
    return (
      <BodyImage
        src={src}
        width={width}
        height={height}
        alt={alt}
        caption={caption}
      />
    )
  },
  ImageWithCaption: ({
    src,
    width,
    height,
    alt,
    captionTitle,
    captionSubtitle,
    reducedMargins,
    noMarginTop,
    caption,
  }: ImageWithCaptionProps) => {
    return (
      <ImageWithCaption
        src={src}
        width={width}
        height={height}
        alt={alt}
        captionTitle={captionTitle}
        captionSubtitle={captionSubtitle}
        reducedMargins={reducedMargins}
        noMarginTop={noMarginTop}
        caption={caption}
      />
    )
  },
  TeamMemberCard: ({imageUrl, name, title}: TeamMemberCardProps) => {
    return <TeamMemberCard imageUrl={imageUrl} name={name} title={title} />
  },
  RelatedTeamMembers: ({children}: React.PropsWithChildren) => {
    return <RelatedTeamMembers>{children}</RelatedTeamMembers>
  },
  TweetEmbed: ({tweetId, caption, showCards}: TweetEmbedProps) => {
    return (
      <TweetEmbed tweetId={tweetId} caption={caption} showCards={showCards} />
    )
  },
  TweetEmbedDouble: ({tweetId_1, tweetId_2}: TweetEmbedDoubleProps) => {
    return <TweetEmbedDouble tweetId_1={tweetId_1} tweetId_2={tweetId_2} />
  },
  SkeletonHandSeparator: ({
    id,
    number,
    title,
    subtitle,
  }: SkeletonHandSeparatorProps) => {
    return (
      <SkeletonHandSeparator
        id={id}
        number={number}
        title={title}
        subtitle={subtitle}
      />
    )
  },
  IntroduceCard: ({id, image, name, title}: IntroduceCardProps) => {
    return <IntroduceCard id={id} image={image} name={name} title={title} />
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
  AccentedTitle: ({text, color, href}: AccentedTitleProps) => {
    return <AccentedTitle text={text} color={color} href={href} />
  },
  AccentedSubtitle: ({
    children,
    color,
  }: React.PropsWithChildren<AccentedSubtitleProps>) => {
    return <AccentedSubtitle color={color}>{children}</AccentedSubtitle>
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
  Toc: ({children}: React.PropsWithChildren) => {
    return <Toc>{children}</Toc>
  },
  TocItem: ({title, anchor}: TocItemProps) => {
    return <TocItem title={title} anchor={anchor} />
  },
  ContentWithTopGap: ({children}: React.PropsWithChildren) => {
    return <ContentWithTopGap>{children}</ContentWithTopGap>
  },
  EmbedVideo: ({playbackId, poster, title}: EmbedVideoProps) => {
    return (
      <EmbedVideo
        playbackId={playbackId}
        {...(poster && {poster})}
        {...(title && {title})}
      />
    )
  },
  DecoratedList: ({
    children,
    color,
    type,
    reducedSpacing,
  }: React.PropsWithChildren<DecoratedListProps>) => {
    return (
      <DecoratedList color={color} type={type} reducedSpacing={reducedSpacing}>
        {children}
      </DecoratedList>
    )
  },
  FloatedImage: ({src, width, height, alt, floatSide}: FloatedImageProps) => {
    return (
      <FloatedImage
        src={src}
        width={width}
        height={height}
        alt={alt}
        floatSide={floatSide}
      />
    )
  },
  FancyTitleWithSubtitle: ({title, subtitle}: FancyTitleWithSubtitleProps) => {
    return <FancyTitleWithSubtitle title={title} subtitle={subtitle} />
  },
  FullTranscript: ({children}: React.PropsWithChildren) => {
    return <FullTranscript>{children}</FullTranscript>
  },
  ResourcesLinks: ({resources}: ResourcesLinksProps) => {
    return <ResourcesLinks resources={resources} />
  },
}

export default mdxComponents
