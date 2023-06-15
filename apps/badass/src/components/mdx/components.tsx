import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import Balancer from 'react-wrap-balancer'

type BodyBlockquoteProps = {
  color: 'blue' | 'green' | 'red' | 'pink' | 'yellow'
}

const BodyBlockquote: React.FC<
  React.PropsWithChildren<BodyBlockquoteProps>
> = ({children, color}) => {
  return (
    <div
      data-body-blockquote=""
      data-body-blockquote-color={color}
      className="not-prose"
    >
      <blockquote data-color={color} className="pl-6 py-4">
        <Balancer>{children}</Balancer>
      </blockquote>
    </div>
  )
}

type BodyImageProps = {
  src: string
  width: number
  height: number
  alt?: string
}

const BodyImage: React.FC<BodyImageProps> = ({
  src,
  width,
  height,
  alt = '',
}) => {
  return (
    <div data-body-image="">
      <Image src={src} width={width} height={height} alt={alt} />
    </div>
  )
}

type TeamMemberCardProps = {
  imageUrl: string
  name: string
  title: string
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  imageUrl,
  name,
  title,
}) => {
  return (
    <div data-team-member-card="" className="not-prose">
      <div data-team-member-image="">
        <Image src={imageUrl} width={120} height={120} alt={name} />
      </div>
      <div data-team-member-info="">
        <h4 data-team-member-name>{name}</h4>
        <p data-team-member-title>{title}</p>
      </div>
    </div>
  )
}

type RelatedTeamMembersProps = {
  children: TeamMemberCardProps[]
}

const RelatedTeamMembers: React.FC<React.PropsWithChildren> = ({children}) => {
  return <div data-related-team-members="">{children}</div>
}

const mdxComponents = {
  BodyBlockquote: ({
    children,
    color,
  }: React.PropsWithChildren<BodyBlockquoteProps>) => {
    return <BodyBlockquote color={color}>{children}</BodyBlockquote>
  },
  BodyImage: ({
    src,
    width,
    height,
    alt,
  }: React.PropsWithChildren<BodyImageProps>) => {
    return <BodyImage src={src} width={width} height={height} alt={alt} />
  },
  TeamMemberCard: ({imageUrl, name, title}: TeamMemberCardProps) => {
    return <TeamMemberCard imageUrl={imageUrl} name={name} title={title} />
  },
  RelatedTeamMembers: ({children}: React.PropsWithChildren) => {
    return <RelatedTeamMembers>{children}</RelatedTeamMembers>
  },
}

export default mdxComponents
