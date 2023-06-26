import Image from 'next/image'

type TeamMemberItem = {
  name: string
  portrait: string
}
export type TeamMembersBlockProps = {
  description: string
  members: TeamMemberItem[]
  title: string
}

const TeamMembersBlock: React.FC<TeamMembersBlockProps> = ({
  description,
  members,
  title,
}) => {
  return (
    <div data-team-members-block="" className="not-prose">
      {description && <p data-team-members-description>{description}</p>}
      {members && (
        <div data-team-members-info-wrapper={members.length == 1 ? 'flex' : ''}>
          <div data-team-members-portraits="">
            {members.map((member, i) => {
              return (
                <div data-team-member-portrait="">
                  <Image
                    src={member.portrait}
                    alt="Team Member Portrait"
                    width={112}
                    height={112}
                  />
                </div>
              )
            })}
          </div>
          <div>
            <div data-team-members-names="">
              {members.map((member, i) => {
                return (
                  <span data-team-member-name="">
                    {member.name}
                    {i < members.length - 2 && ', '}
                    {i == members.length - 2 && ' & '}
                  </span>
                )
              })}
            </div>
            <div data-team-members-title>{title}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamMembersBlock
