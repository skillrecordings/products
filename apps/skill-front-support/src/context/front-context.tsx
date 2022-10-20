import * as React from 'react'
import Front from '@frontapp/plugin-sdk'
import {get} from 'lodash'
import axios from 'axios'

const defaultFrontContext: any = {}

export const FrontContext = React.createContext(defaultFrontContext)

export function useFront() {
  return React.useContext(FrontContext)
}

export const FrontProvider = ({children}: {children: React.ReactNode}) => {
  const [eggheadUser, setEggheadUser] = React.useState<any>(false)
  const [email, setEmail] = React.useState<any>()
  const [currentFrontContext, setCurrentFrontContext] = React.useState<any>()

  React.useEffect(() => {
    Front.contextUpdates.subscribe((frontContext) => {
      setCurrentFrontContext(frontContext)

      async function loadUser(email: string) {
        const userToken =
          localStorage.getItem('userToken') ||
          process.env.NEXT_PUBLIC_SUPPORT_BOT_KEY
        const headers = {
          Authorization: `Bearer ${userToken}`,
        }
        setEmail(email)

        const user = await axios
          .get(
            `https://app.egghead.io/api/v1/users/${email}?by_email=true&support=true`,
            {headers},
          )
          .then(({data}) => data)

        console.log(user)

        setEggheadUser(user)
      }

      const conversation = get(frontContext, 'conversation')
      console.log(frontContext.type)
      switch (frontContext.type) {
        case 'noConversation':
          console.log('No conversation selected')
          break
        case 'singleConversation':
          console.log('Selected conversation:', conversation)
          loadUser(conversation.recipient.handle)
          break
        case 'multiConversations':
          console.log(
            'Multiple conversations selected',
            get(frontContext, 'conversations'),
          )
          break
        default:
          console.error(`Unsupported frontContext type: ${frontContext.type}`)
          break
      }
    })
  }, [])

  return (
    <FrontContext.Provider
      value={{currentFrontContext, eggheadUser, selectedEmail: email}}
    >
      {children}
    </FrontContext.Provider>
  )
}
