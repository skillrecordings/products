import * as React from 'react'
import type {Achievement, SellableResource} from '@types'
import useAchievements from 'hooks/use-achievements'
import Markdown from 'react-markdown'
import Spinner from 'components/spinner'

const Achievements: React.FC<{
  purchasedBundle: SellableResource | undefined
}> = ({purchasedBundle}) => {
  const {achievements} = useAchievements(purchasedBundle)
  return (
    <div className="space-y-2">
      <h4 className="font-medium opacity-90">Achievements</h4>
      {purchasedBundle ? (
        achievements.map((achievement: Achievement) => {
          const {earned, title, link} = achievement
          return (
            <div
              key={title}
              className={`flex space-x-5 items-center leading-tight dark:bg-gray-900 bg-gray-100 ${
                earned
                  ? 'py-4 px-6 border-l-4 border-teal-500'
                  : 'py-6 px-6 border-l-4 border-transparent'
              }`}
            >
              <div
                className={
                  earned ? 'dark:text-teal-400 text-teal-500' : 'opacity-50'
                }
              >
                <i className={earned ? 'gg-check' : 'gg-trophy'} />
              </div>
              <div>
                <Markdown className="font-medium leading-none">
                  {title}
                </Markdown>
                {earned && link && (
                  <button
                    className="text-sm opacity-80 hover:opacity-100 font-medium text-teal-600 dark:text-teal-400 hover:underline"
                    onClick={link.onClick}
                  >
                    {link.children}
                  </button>
                )}
              </div>
            </div>
          )
        })
      ) : (
        <div className="flex space-x-5 items-center leading-tight dark:bg-gray-900 bg-gray-100            py-6 px-6 border-l-4 border-transparent">
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default Achievements
