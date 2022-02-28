import * as React from 'react'

export type FooterProps = {}

const Footer: React.FC<FooterProps> = () => {
  return <footer className="pt-24 print:hidden">©</footer>
}

export default Footer
