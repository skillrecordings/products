import {isString} from 'lodash'

export const getErrorMessage = (error: any) => {
  if (isString(error)) {
    return error
  } else if (error?.message) {
    return error?.message
  } else if (error) {
    return 'An error has occurred'
  }
}
