import * as React from 'react'
import {Theme} from '../types'

export type TestErrorTypes = 'default'

export interface TestServerPageParams {
  theme: Theme
}

export default function TestPage(props: TestServerPageParams) {
  const {theme} = props

  if (typeof document !== 'undefined' && theme.brandColor) {
    document.documentElement.style.setProperty(
      '--brand-color',
      theme.brandColor,
    )
  }

  const errors: Record<TestErrorTypes, string> = {
    default: 'Unable to show test.',
  }

  const error = false

  return (
    <div className="test">
      {theme.brandColor && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `,
          }}
        />
      )}
      <h1>This is a Test</h1>
      {theme.logo && <img src={theme.logo} alt="Logo" className="logo" />}
      <div className="card">
        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
