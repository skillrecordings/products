import * as React from 'react'
import {Release} from 'pages'
import cx from 'classnames'

const DownloadKitApp: React.FC<
  React.PropsWithChildren<{
    macIntelRelease: Release
    macSilliconRelease: Release
    windowsPreviewRelease: Release
    linuxCommunityRelease?: Release
  }>
> = ({
  macIntelRelease,
  macSilliconRelease,
  windowsPreviewRelease,
  linuxCommunityRelease,
}) => {
  const [isHovered, setIsHovered] = React.useState('')
  const macReleases = [
    {...macIntelRelease, label: 'Intel'},
    {...macSilliconRelease, label: 'Apple Sillicon'},
  ]

  return (
    <div className="flex flex-col items-center justify-center gap-5 relative">
      <h3 className="font-heading tracking-wider sm:text-sm text-xs uppercase text-gray-300">
        Download Script Kit:
      </h3>
      <div className="relative flex md:flex-row flex-col items-center justify-center md:gap-3 gap-5">
        <div className="relative">
          <div className="inline-flex items-center gap-5 rounded-xl bg-white text-black pl-4 overflow-hidden">
            <div className="font-medium flex items-center gap-1 h-full">
              <AppleIcon /> MacOS
            </div>
            <div className="flex items-center border-l border-gray-100">
              {macReleases.map((release, i) => {
                return (
                  <div key={release.label} className="relative group flex 00">
                    <a
                      onMouseOver={() => setIsHovered(release.name)}
                      onMouseOut={() => setIsHovered('')}
                      className={cx(
                        'font-medium tracking-tight flex items-center p-4 bg-gray-50 hover:bg-gray-200/70 transition',
                        {
                          'border-r border-gray-100': i === 0,
                        },
                      )}
                      href={release?.browser_download_url}
                      onMouseUp={(e) => {
                        e.preventDefault()
                        fetch('/api/update-twitter-count')
                      }}
                    >
                      <DownloadIcon className="flex-shrink-0 text-gray-400/80" />
                      <span className="pl-1">{release.label}</span>
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full translate-y-1.5 h-full rounded-xl from-gray-300 via-gray-200 to-gray-300 bg-gradient-to-r -z-10" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-5 rounded-xl overflow-hidden bg-gray-900 text-white pl-4">
            <div className="font-medium flex items-center gap-1">
              <WindowsIcon /> Windows
            </div>
            <div className="flex items-center bg-gray-800">
              <div className="relative group flex 00">
                <a
                  onMouseOver={() => setIsHovered(windowsPreviewRelease.name)}
                  onMouseOut={() => setIsHovered('')}
                  className={cx(
                    'font-normal tracking-tight flex items-center p-4 hover:bg-gray-700/50 transition',
                    {},
                  )}
                  href={windowsPreviewRelease?.browser_download_url}
                  onMouseUp={(e) => {
                    e.preventDefault()
                    fetch('/api/update-twitter-count')
                  }}
                >
                  <DownloadIcon className="flex-shrink-0 text-gray-500" />
                  <span className="pl-1">x64 (Beta)</span>
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full translate-y-1.5 h-full rounded-xl from-gray-800 via-gray-900 to-gray-900 bg-gradient-to-r -z-10" />
        </div>
      </div>
      {linuxCommunityRelease && (
        <div className="relative">
          <div className="inline-flex items-center gap-5 rounded-xl overflow-hidden bg-gray-900 text-white pl-4">
            <div className="font-medium flex items-center gap-1">
              <LinuxIcon /> Linux (Community)
            </div>
            <div className="flex items-center bg-gray-800">
              <div className="relative group flex 00">
                <a
                  onMouseOver={() =>
                    setIsHovered(
                      `Linux is community supported from contributors like you! (${linuxCommunityRelease.name})`,
                    )
                  }
                  onMouseOut={() => setIsHovered('')}
                  className={cx(
                    'font-normal tracking-tight flex items-center p-4 hover:bg-gray-700/50 transition',
                    {},
                  )}
                  href={linuxCommunityRelease?.browser_download_url}
                  onMouseUp={(e) => {
                    e.preventDefault()
                    fetch('/api/update-twitter-count')
                  }}
                >
                  <DownloadIcon className="flex-shrink-0 text-gray-500" />
                  <span className="pl-1">x64 (Beta)</span>
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full translate-y-1.5 h-full rounded-xl from-gray-800 via-gray-900 to-gray-900 bg-gradient-to-r -z-10" />
        </div>
      )}
      <div className=" w-full text-center text-xs opacity-50 absolute md:-bottom-8 -bottom-12">
        {isHovered}
      </div>
    </div>
  )
}

const AppleIcon = () => {
  return (
    <svg
      className="w-4 pb-1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
    >
      <title>apple</title>
      <g fill="currentColor">
        <path
          fill="currentColor"
          d="M14.326,12.08c-0.346,0.766-0.511,1.108-0.957,1.785c-0.621,0.945-1.496,2.123-2.581,2.133 c-0.964,0.009-1.212-0.627-2.52-0.62S6.686,16.009,5.722,16c-1.085-0.01-1.914-1.073-2.536-2.019 C1.45,11.337,1.268,8.235,2.339,6.586c0.761-1.173,1.962-1.858,3.092-1.858c1.15,0,1.872,0.63,2.823,0.63 c0.922,0,1.484-0.631,2.814-0.631c1.005,0,2.07,0.547,2.828,1.492C11.411,7.582,11.815,11.131,14.326,12.08L14.326,12.08z"
        ></path>{' '}
        <path d="M10.604,2.699c0.546-0.7,0.96-1.689,0.809-2.699C10.522,0.061,9.48,0.628,8.871,1.367 C8.319,2.038,7.863,3.033,8.04,4C9.013,4.03,10.019,3.449,10.604,2.699L10.604,2.699z"></path>
      </g>
    </svg>
  )
}

const WindowsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3 text-gray-200"
      viewBox="0 0 32 32"
    >
      <title>microsoft</title>
      <g fill="currentColor">
        <rect x="1" y="1" fill="currentColor" width="14" height="14"></rect>{' '}
        <rect x="17" y="1" width="14" height="14"></rect>{' '}
        <rect x="1" y="17" width="14" height="14"></rect>{' '}
        <rect x="17" y="17" fill="currentColor" width="14" height="14"></rect>
      </g>
    </svg>
  )
}

const LinuxIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6" viewBox="0 0 48 48">
      <title>linux</title>
      <g>
        <path
          d="M22.625,10.125c2.031-.472,5.813,2.937,7.937,6.75a41.774,41.774,0,0,1,4,12.625c.438,3.125,1.313,9.981-.812,11.553S26.592,43.5,23.233,43.562s-7.671-.124-9.171-4.374-1.937-7.626-1.374-10.438S16,20.938,17,19.5s1.029-1.266,1.4-3.688S20.329,10.658,22.625,10.125Z"
          fill="#fff"
        />
        <path
          d="M17.9,45.428c2.851-1.371,8.879-1.227,12.993,0s1.876-11.78.343-8.21a8.618,8.618,0,0,1-7.832,5.323c-6.6,0-8.68-4.728-8.68-4.728Z"
          fill="#020204"
        />
        <path
          d="M31.451,46.523c1.746,1.165,3.7-.048,4.715-1.034a14.146,14.146,0,0,1,3.586-2.671,8.842,8.842,0,0,0,3.2-2.021c.385-.65.336-1.4-.674-1.973a4.614,4.614,0,0,1-2.334-2.406c-.217-.963-.024-1.853-.77-2.431s-4.278-.605-5.293-.649-2.527-.385-2.96,0-.192,1.877-.168,2.7a44.208,44.208,0,0,1-.361,4.908C30.223,41.879,28.924,44.839,31.451,46.523Z"
          fill="#f5bd0c"
        />
        <path
          d="M17.8,16.411V7.659A6.659,6.659,0,0,1,24.455,1h0a6.659,6.659,0,0,1,6.659,6.659v6.009c0,2.166,2.779,5.017,4.583,7a16.048,16.048,0,0,1,3.537,8.3c.253,2.743-.191,5.9-2.526,6.965-2.057.939-4.067-.139-3.966-2.7.034-.847.393-5.523-.762-8.88a96.12,96.12,0,0,0-4.574-9.757s-8.275-1.72-8.275.337A8.88,8.88,0,0,1,17.8,20.742c-1.552,2.779-4.548,7.724-4.151,11.73,1.251,1.861,3.429,3.182,4.331,3.9s1.588,2.055,1.047,2.849-3.1.252-3.862,0S10.9,34.06,10.469,33.266a4.261,4.261,0,0,1-.036-3.429c.506-1.408,1.769-3.248,2.346-4.981a19.872,19.872,0,0,1,2.779-5.125C16.749,18.071,17.507,17.927,17.8,16.411Z"
          fill="#020204"
        />
        <ellipse cx="25.64" cy="10.444" rx="2.178" ry="3.116" fill="#fff" />
        <path
          d="M21.86,10.292c.121,1.447-.592,2.687-1.594,2.771s-1.728-1.034-1.849-2.481.409-2.674,1.41-2.758S21.738,8.845,21.86,10.292Z"
          fill="#fff"
        />
        <ellipse
          cx="25.64"
          cy="10.66"
          rx="1.498"
          ry="1.057"
          transform="translate(14.045 35.891) rotate(-87.895)"
          fill="#020204"
        />
        <ellipse
          cx="20.136"
          cy="10.735"
          rx="0.938"
          ry="1.353"
          transform="translate(-1.442 3.313) rotate(-9.083)"
          fill="#020204"
        />
        <path
          d="M22.62,11.009c1.3,0,2.442,1.041,3.134,1.233s1.678.283,2.063,1-.1,1.636-1.155,2.165-2.334,2.022-4.234,2.022-2.6-1.732-3.3-2.286a1.166,1.166,0,0,1-.362-1.757C19.185,12.675,21.2,11.009,22.62,11.009Z"
          fill="#f5bd0c"
        />
        <path
          d="M18.77,45.585c1.2-1.955.409-3.754-.914-5.269a65.39,65.39,0,0,1-4.018-6.184c-.65-.987-1.54-1.877-2.43-1.733s-1.516,1.757-2.094,2.238-2.791.048-3.464.77-.048,3.3-.169,4.524-.77,1.876-.842,2.454.12,1.227,1.2,1.612,5.125,1.4,6.521,1.708S17.231,48.087,18.77,45.585Z"
          fill="#f5bd0c"
        />
      </g>
    </svg>
  )
}

const DownloadIcon: React.FC<{className?: string}> = ({className}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      width="16"
    >
      <path
        className="-translate-y-0.5 group-hover:translate-y-0 transition"
        d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z"
      ></path>
      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z"></path>
    </svg>
  )
}

export default DownloadKitApp
