import {set} from 'lodash'
import {useRouter} from 'next/router'
import React from 'react'

type SearchContextType = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  resourceType?: string
  setResourceType: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const SearchContext = React.createContext({} as SearchContextType)

type SearchProviderProps = {
  children: React.ReactNode
}

export const SearchProvider: React.FC<SearchProviderProps> = ({children}) => {
  const [open, setOpen] = React.useState(false)
  const [resourceType, setResourceType] = React.useState<string | undefined>()

  const router = useRouter()

  // contextual search
  React.useEffect(() => {
    if (router.asPath === '/articles') {
      setResourceType('article')
    }
    if (router.asPath === '/tutorials') {
      setResourceType('tutorial')
    }

    return () => {
      setResourceType(undefined)
    }
  }, [router.asPath])

  console.log({router})
  const context = {
    open,
    setOpen,
    resourceType,
    setResourceType,
  }

  return (
    <SearchContext.Provider value={context}>{children}</SearchContext.Provider>
  )
}

export const useSearchBar = () => {
  return React.useContext(SearchContext)
}
