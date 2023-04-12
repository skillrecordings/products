import {Module} from '@skillrecordings/skill-lesson/schemas/module'

export const getExerciseGitHubUrl = ({
  stackblitz,
  module,
}: {
  stackblitz: string | null | undefined
  module: Module
}) => {
  const openFile = stackblitz?.split(',')[0]
  const exerciseGitHubUrl = `https://github.com/total-typescript/${module.github?.repo}/blob/main/${openFile}`
  return {exerciseGitHubUrl, openFile}
}
