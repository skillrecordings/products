import * as React from 'react'
import Icon from '@/components/icons'

export const CheckMarkItem: React.FC<{children?: React.ReactNode}> = ({
  children,
}) => {
  return (
    <li className="flex items-start space-x-3">
      <Icon
        name="check-circle"
        className="w-4 md:w-[23px] h-4 md:h-[23px] text-[#5cc7c7] shrink-0"
      />
      <span>{children}</span>
    </li>
  )
}

export const QuestionMarkItem: React.FC<{children?: React.ReactNode}> = ({
  children,
}) => {
  return (
    <li className="flex items-start space-x-3">
      <Icon
        name="question-mark"
        className="w-4 md:w-[23px] h-4 md:h-[23px] shrink-0"
      />
      <span>{children}</span>
    </li>
  )
}
