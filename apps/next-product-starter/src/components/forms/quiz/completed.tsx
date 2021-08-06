import config from 'config'
import React from 'react'

const CompletedMessage: React.FC<{
  answeredCorrectly?: boolean
  neutral?: boolean
}> = ({answeredCorrectly, neutral = false}) => {
  return neutral ? (
    <div className="font-medium prose sm:prose-xl prose-lg pt-10 text-center">
      <p>I'll send the next lesson in 5-10 minutes. Check your inbox.</p>
      <p>
        Thanks, <br /> {config.openGraph.profile.firstName}
      </p>
    </div>
  ) : answeredCorrectly ? (
    <div className="font-medium prose sm:prose-xl prose-lg pt-10 border-t border-gray-200 mt-10 text-center">
      <p>Nice work. You chose the correct answer!</p>
      <p>I'll send the next lesson in 5-10 minutes. Check your inbox.</p>
      <p>
        Thanks, <br /> {config.openGraph.profile.firstName}
      </p>
    </div>
  ) : (
    <div className="font-medium prose sm:prose-xl prose-lg pt-10 border-t border-gray-200 mt-10 text-center">
      <p>
        You didn't answer correctly, but don't worry. Just go back and re-read
        the email and check out any linked resources. You can refresh the page
        if you'd like to try again! 👍
      </p>
      <p>I'll send the next email in 5-10 minutes too so you can learn more.</p>

      <p>
        Thanks, <br /> {config.openGraph.profile.firstName}
      </p>
    </div>
  )
}

export default CompletedMessage
