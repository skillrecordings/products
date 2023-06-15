'use client'

import * as React from 'react'
import {type VariantProps, type CxReturn} from 'class-variance-authority'
import {type ClassProp} from 'class-variance-authority/dist/types'

import {defaultButtonVariants} from '../ui/button'
import {defaultLabelVariants} from '../ui/label'
import {defaultInputVariants} from '../ui/input'

export const DEFAULT_THEME: ThemeContextType = {
  variants: {
    button: defaultButtonVariants,
    label: defaultLabelVariants,
    input: defaultInputVariants,
  },
}

type ThemeContextType = {
  variants: {
    button: (
      props: VariantProps<typeof defaultButtonVariants> & ClassProp,
    ) => CxReturn
    label: (
      props?: VariantProps<typeof defaultLabelVariants> & ClassProp,
    ) => CxReturn
    input: (
      props?: VariantProps<typeof defaultInputVariants> & ClassProp,
    ) => CxReturn
  }
}

export const ThemeContext = React.createContext({} as ThemeContextType)

type ThemeProviderProps = {
  theme: ThemeContextType
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme,
  children,
}) => {
  const context = {
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
