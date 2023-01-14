import React from 'react'
import {useFeedback} from 'context/feedback-context'
import {handleSignOut} from './navigation'
import {useRouter} from 'next/router'
import Image from 'next/legacy/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {useNavState} from '../../hooks/use-nav-state'
import {useConvertkit} from '@skillrecordings/convertkit-react-ui'

type FooterProps = {}

const Footer: React.FC<React.PropsWithChildren<FooterProps>> = () => {
  const router = useRouter()
  const {isSignedIn, canViewInvoice, canViewTeam} = useNavState()
  const {subscriber} = useConvertkit()
  const {setIsFeedbackDialogOpen} = useFeedback()
  return (
    <footer className="font-nav">
      <div className="w-full bg-white flex items-center justify-end relative overflow-hidden">
        <div className="lg:p-5 sm:p-12 p-5 max-w-screen-lg mx-auto w-full sm:h-[373px] lg:py-12 sm:py-12 py-10 flex flex-col justify-between">
          <nav
            aria-label="footer"
            className="md:grid flex flex-col lg:grid-cols-6 grid-cols-5 lg:gap-5 gap-10"
          >
            <div>
              <h2 className="text-orange-700 font-semibold">Learn</h2>
              <ul className="pt-4">
                {isSignedIn && (
                  <li>
                    <NavLink href="/learn">Pro Workshops</NavLink>
                  </li>
                )}
                <li>
                  <NavLink href="/articles">Articles</NavLink>
                </li>
                <li>
                  <NavLink href="/accessibility-reviews">Reviews</NavLink>
                </li>
                <li>
                  <NavLink href="/workshops">Live Events</NavLink>
                </li>
                {!subscriber && (
                  <li>
                    <NavLink href="/newsletter">Newsletter</NavLink>
                  </li>
                )}
              </ul>
            </div>
            {isSignedIn && (
              <div>
                <h2 className="text-orange-700 font-semibold">Account</h2>
                <ul className="pt-4">
                  {canViewTeam && (
                    <li>
                      <NavLink href="/team">Invite Team</NavLink>
                    </li>
                  )}
                  {canViewInvoice && (
                    <li>
                      <NavLink href="/invoices">Invoices</NavLink>
                    </li>
                  )}
                  <li>
                    <NavLink
                      onClick={() => setIsFeedbackDialogOpen(true, 'footer')}
                    >
                      Feedback
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={async () => {
                        await handleSignOut(router)
                        toast.success('Signed out successfully')
                      }}
                    >
                      Sign Out
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}
            <div>
              <h2 className="text-orange-700 font-semibold">About</h2>
              <ul className="pt-4">
                <li>
                  <NavLink href="/faq">FAQ</NavLink>
                </li>
                <li>
                  <NavLink href="/credits">Credits</NavLink>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-orange-700 font-semibold">Contact</h2>
              <ul className="pt-4">
                <li>
                  <NavLink href="/contact">Contact Us</NavLink>
                </li>
                <li>
                  <NavLink
                    aria-label="email the testing accessibility support team"
                    href="mailto:Testing%20Accessibility%20Support%20%3Cteam%40testingaccessibility.com%3E?subject=Help%20with%20Testing%20Accessibilty"
                  >
                    Email Support
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
          <div className="w-full items-center flex gap-8 sm:pt-0 pt-16">
            <small className="text-sm">© Testing Accessibility</small>
            <Link href="/terms">
              <a className="hover:underline text-sm">Terms & Conditions</a>
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

const NavLink: React.FC<React.PropsWithChildren<NavLinkProps>> = ({
  href,
  children,
  onClick,
  ...props
}) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="py-1 inline-flex text-base font-medium hover:underline transition"
        {...props}
      >
        {children}
      </button>
    )
  }
  if (href) {
    return (
      <Link href={href} {...props}>
        <a className="py-1.5 inline-flex text-base font-medium hover:underline transition leading-tight">
          {children}
        </a>
      </Link>
    )
  }
  return null
}

export default Footer
