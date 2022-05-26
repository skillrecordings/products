import * as React from 'react'
import {Purchase} from '@prisma/client'

export type User = {
  name: string
  email: string
  picture: string
  sub: string
  id: string
  iat: number
  exp: number
  jti: string
  purchases: Purchase[]
}

type UserContextType = {
  user: User | null
}

const UserContext = React.createContext<UserContextType>({
  user: null,
})

export function useUser() {
  return React.useContext(UserContext)
}

export const UserProvider: React.FC<{user: User}> = ({user, children}) => {
  return <UserContext.Provider value={{user}}>{children}</UserContext.Provider>
}
