import React from 'react'

const Logo = ({isMobile}: {isMobile: boolean}) => {
  return (
    <>
      <svg
        className="text-er-primary"
        xmlns="http://www.w3.org/2000/svg"
        width={isMobile ? 40 : 44}
        height={isMobile ? 40 : 44}
        viewBox="0 0 55 55"
      >
        <g
          fill="none"
          fillRule="evenodd"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.5"
          transform="translate(2 2)"
        >
          <path
            d="M36.9064197,31.9820661 C45.0444814,30.8275353 50.6225585,28.4631462 50.6225585,25.7339648 C50.6225585,21.8679716 39.4296773,18.7339648 25.6225585,18.7339648 C11.8154398,18.7339648 0.622558502,21.8679716 0.622558502,25.7339648 C0.622558502,27.8173667 3.87317565,29.6881864 9.03178558,30.970489"
            transform="rotate(-30 25.623 25.358)"
          />
          <path
            d="M32.7479445,31.5010804 C30.3508302,36.3491567 27.8284543,39.3481369 28.0697413,39.3981948 C39.9797202,38.863136 48.9972091,36.2088176 48.9972091,32.7231929 C48.9972091,29.1497591 39.4342745,26.2017174 27.0831443,25.7759947"
            transform="rotate(30 38.04 32.587)"
          />
          <path
            d="M11.4200909,11.3440584 C6.23860052,12.6266191 2.97139919,14.501662 2.97139919,16.5903717 C2.97139919,19.3404165 8.63508614,21.7200703 16.874621,22.8647381"
            transform="rotate(30 9.923 17.104)"
          />
          <path
            d="M9.00053159,19.4945846 C3.50061003,20.7786291 0.0006256,22.7115771 0.0006256,24.8734154 C0.0006256,28.7394086 11.1935069,31.8734154 25.0006256,31.8734154 C38.8077443,31.8734154 50.0006256,28.7394086 50.0006256,24.8734154 C50.0006256,22.7432502 46.6024463,20.8353174 41.2411647,19.5514386"
            transform="rotate(90 25 25.684)"
          />
        </g>
      </svg>

      <div className="ml-1 text-text">
        <div
          className="flex items-center leading-5"
          style={{
            fontSize: isMobile ? 20 : 22,
            fontWeight: 600,
            letterSpacing: '-0.008em',
          }}
        >
          Epic React
        </div>
        <div
          style={{
            fontSize: isMobile ? 12.5 : 13.5,
            opacity: 0.85,
            letterSpacing: 0,
          }}
        >
          by Kent C. Dodds
        </div>
      </div>
    </>
  )
}

export default Logo
