'use client'

import React from 'react'

type SearchContextType = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const SearchContext = React.createContext({} as SearchContextType)

type SearchProviderProps = {
  children: React.ReactNode
}

export const SearchProvider: React.FC<SearchProviderProps> = ({children}) => {
  const [open, setOpen] = React.useState(false)
  const context = {
    open,
    setOpen,
  }

  return (
    <SearchContext.Provider value={context}>{children}</SearchContext.Provider>
  )
}

export const useSearchBar = () => {
  return React.useContext(SearchContext)
}
