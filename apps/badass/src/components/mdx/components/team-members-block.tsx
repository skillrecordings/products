import Image from 'next/image'

export type TeamMembersBlockProps = {
  description: string
  title: string
  name: string
  portrait: string
  portraitWidth: number
  portraitHeight: number
  multiple?: boolean
  reducedTopMargin?: boolean
  reducedBottomMargin?: boolean
}

const TeamMembersBlock: React.FC<TeamMembersBlockProps> = ({
  description,
  title,
  name,
  portrait,
  portraitWidth,
  portraitHeight,
  multiple = false,
  reducedTopMargin = false,
  reducedBottomMargin = false,
}) => {
  return (
    <div
      data-team-members-block=""
      data-reduced-top-margin={reducedTopMargin}
      data-reduced-bottom-margin={reducedBottomMargin}
      className="not-prose"
    >
      <div data-team-members-info-wrapper={!multiple ? 'flex' : ''}>
        <div data-team-member-portrait="">
          <Image
            src={portrait}
            alt="Team Member Portrait"
            width={portraitWidth}
            height={portraitHeight}
          />
        </div>
        <div>
          <div data-team-member-name="">{name}</div>
          <div data-team-members-title>{title}</div>
        </div>
      </div>
      {description && <p data-team-members-description>{description}</p>}
    </div>
  )
}

export default TeamMembersBlock
