import * as React from 'react'
import {type VariantProps, type CxReturn} from 'class-variance-authority'
import {type ClassProp} from 'class-variance-authority/dist/types'
import {defaultButtonVariants} from '../ui/button'
import {defaultTheme} from '../ui/utils'
import {defaultLabelVariants} from '../ui/label'

type ThemeContextType = {
  buttonVariants?: (
    props: VariantProps<typeof defaultButtonVariants> & ClassProp,
  ) => CxReturn
  labelVariants?: (
    props?: VariantProps<typeof defaultLabelVariants> & ClassProp,
  ) => CxReturn
}

export const ThemeContext = React.createContext({} as ThemeContextType)

type ThemeProviderProps = {
  theme?: ThemeContextType
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme,
  children,
}) => {
  const context = {
    ...defaultTheme,
    ...theme,
  }

  return (
    <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const themeContext = React.useContext(ThemeContext)
  return themeContext
}
