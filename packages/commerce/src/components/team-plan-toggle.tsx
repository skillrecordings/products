import React from 'react'
import {motion} from 'framer-motion'

type TeamPlanToggleProps = {
  planType: 'individual' | 'team'
  activateTeamPlan: () => void
  activateIndividualPlan: () => void
}

const TeamPlanToggle = ({
  planType,
  activateTeamPlan,
  activateIndividualPlan,
}: TeamPlanToggleProps) => {
  return (
    <div className="flex items-center">
      <button
        className={`-ml-7 ${
          planType === 'individual' ? 'opacity-100' : 'opacity-75'
        } hover:opacity-100 transition-opacity duration-200 ease-in-out`}
        onClick={() => activateIndividualPlan()}
      >
        For Individuals
      </button>
      <button
        onClick={() =>
          planType === 'individual'
            ? activateTeamPlan()
            : activateIndividualPlan()
        }
        className="mx-2 h-7 w-14 flex items-center relative rounded-full bg-gray-200 border border-gray-300 hover:bg-gray-300"
      >
        <motion.div
          className={`${
            planType === 'individual'
              ? 'left-1 bg-gray-500'
              : 'right-1 bg-yellow-400'
          } absolute  w-5 h-5 rounded-full`}
        />
      </button>
      <button
        className={`${
          planType === 'team' ? 'opacity-100' : 'opacity-75'
        } hover:opacity-100 transition-opacity duration-200 ease-in-out`}
        onClick={() => activateTeamPlan()}
      >
        For Teams
      </button>
    </div>
  )
}

export default TeamPlanToggle
