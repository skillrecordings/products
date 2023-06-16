import Image from 'next/image'

export type TeamMemberCardProps = {
  imageUrl: string
  name: string
  title: string
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
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

const RelatedTeamMembers: React.FC<React.PropsWithChildren> = ({children}) => {
  return <div data-related-team-members="">{children}</div>
}

export default RelatedTeamMembers
