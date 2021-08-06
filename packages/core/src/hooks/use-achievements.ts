import * as React from 'react'
import useBundleProgress from './use-bundle-progress'
import type {Achievement} from '../@types'
import {isEmpty} from 'lodash'

export default function useAchievements(purchasedBundle: any) {
  const {progress} = useBundleProgress(purchasedBundle)
  const modules = progress?.data?.resources.filter(
    (m: any) => m.lesson_count !== 0,
  )
  const [completedArr, setCompletedArr] = React.useState([])

  React.useEffect(() => {
    const completed = modules?.map(
      (module: any) => module.state === 'completed',
    )
    setCompletedArr(completed)
  }, [progress])

  // TODO: achievements should vary based on tier since they have different number of modules
  const achievements: Achievement[] | any = !isEmpty(completedArr) && [
    {
      title: 'Finish 1st module',
      earned: completedArr[0] === true,
      image: '',
      link: {
        children: 'Download certificate',
        onClick: () => {
          window.alert('todo: check if name is present -> download certificate')
        },
      },
    },
    {
      title: 'Finish 3 modules',
      earned: completedArr.filter((i) => i === true).length >= 3,
      image: '',
      link: {
        children: 'Download certificates',
        onClick: () => {
          window.alert(
            'todo: check if name is present -> download 3 certificates',
          )
        },
      },
    },
    {
      title: 'Finish 5 modules',
      earned: completedArr.filter((i) => i === true).length >= 5,
      image: '',
      link: {
        children: 'Download certificates',
        onClick: () => {
          window.alert(
            'todo: check if name is present -> download 5 certificates',
          )
        },
      },
    },
    {
      title: 'Finish **all** modules',
      earned: completedArr.filter((i) => i === true).length >= 5,
      image: '',
      link: {
        children: 'Download workshop certificate',
        onClick: () => {
          window.alert(
            'todo: check if name is present -> download workshop certificate',
          )
        },
      },
    },
  ]

  return {achievements}
}
