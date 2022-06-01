import React from 'react'
import {useFeedback} from 'context/feedback-context'
import {handleSignOut} from './navigation'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import {isSellingLive} from 'utils/is-selling-live'
import {useNavState} from '../../hooks/use-nav-state'

type FooterProps = {}

const Footer: React.FC<FooterProps> = () => {
  const router = useRouter()
  const {isSignedIn} = useNavState()

  const {setIsFeedbackDialogOpen} = useFeedback()
  return (
    <footer>
      <div className="w-full bg-white flex items-center justify-end relative overflow-hidden">
        <div className="lg:p-5 sm:p-12 p-5 max-w-screen-lg mx-auto w-full sm:h-[373px] lg:py-16 sm:py-16 py-10 flex flex-col justify-between">
          <nav
            aria-label="footer"
            className="md:grid flex flex-col grid-cols-5 lg:gap-5 gap-10"
          >
            <div>
              <strong className="text-orange-700 font-semibold">Learn</strong>
              <ul className="pt-4">
                <li>
                  <NavLink href={isSignedIn ? '/learn' : '/workshops'}>
                    Workshops
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink href="/accessibility-reviews">
                    Accessibility Reviews
                  </NavLink>
                </li> */}
                <li>
                  <NavLink href="/articles">Articles</NavLink>
                </li>
              </ul>
            </div>
            {isSignedIn && (
              <div>
                <strong className="text-orange-700 font-semibold">
                  Account
                </strong>
                <ul className="pt-4">
                  <li>
                    <NavLink href="/invoices">Invoices</NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={() => setIsFeedbackDialogOpen(true, 'footer')}
                    >
                      Feedback
                    </NavLink>
                  </li>
                  <li>
                    <NavLink onClick={() => handleSignOut(router)}>
                      Sign Out
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}
            {isSellingLive && (
              <div>
                <strong className="text-orange-700 font-semibold">About</strong>
                <ul className="pt-4">
                  <li>
                    <NavLink href="/faq">FAQ</NavLink>
                  </li>
                  <li>
                    <NavLink href="/credits">Credits</NavLink>
                  </li>
                </ul>
              </div>
            )}
          </nav>
          <div className="w-full items-center flex gap-8 sm:pt-0 pt-16">
            <small className="font-dinosaur text-sm">
              © Testing Accessibility
            </small>
            <Link href="/terms">
              <a className="hover:underline font-dinosaur text-sm">
                Terms & Conditions
              </a>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 lg:max-w-[400px] sm:max-w-[300px] max-w-[200px]">
          <Image
            src={require('../../../public/assets/footer-background@2x.png')}
            alt=""
            priority
            placeholder="blur"
            aria-hidden="true"
            quality={100}
          />
        </div>
      </div>
    </footer>
  )
}

type NavLinkProps = {
  href?: string
  onClick?: () => void
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  onClick,
  ...props
}) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="py-1 inline-flex text-base font-dinosaur font-medium hover:underline transition"
        {...props}
      >
        {children}
      </button>
    )
  }
  if (href) {
    return (
      <Link href={href} {...props}>
        <a className="py-1 inline-flex text-base font-dinosaur font-medium hover:underline transition">
          {children}
        </a>
      </Link>
    )
  }
  return null
}

export default Footer
