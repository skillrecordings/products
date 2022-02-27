import * as React from 'react'
import {render} from '@testing-library/react'
import Navigation from './navigation'

test('renders root link', () => {
  const {getByText} = render(<Navigation />)
  const linkElement = getByText(/Product/)
  expect(linkElement).toBeInTheDocument()
})
