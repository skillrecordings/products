import React from 'react'
import Layout from '@/components/app/layout'
import {GetServerSideProps} from 'next'
import {getCsrfToken, getProviders} from 'next-auth/react'
import LoginTemplate, {
  type LoginTemplateProps,
} from '@skillrecordings/skill-lesson/templates/login'
import {Logo} from '@/components/app/navigation'
import {AnimatedLogo} from '@/components/spinner'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)

  return {
    props: {
      providers,
      csrfToken,
    },
  }
}

const LoginPage: React.FC<LoginTemplateProps> = ({csrfToken, providers}) => {
  return (
    <Layout
      meta={{title: `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}
      className="relative overflow-hidden"
    >
      <LoginTemplate
        image={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 text-gray-600"
            fill="none"
            viewBox="0 0 30 26"
          >
            <path
              fill="currentColor"
              d="m.56 15.002 5.012 8.696A4.205 4.205 0 0 0 9.206 25.8h4.388L2.754 6.99.56 10.8a4.222 4.222 0 0 0 0 4.203Zm28.88-4.203-5.012-8.697A4.206 4.206 0 0 0 20.794 0h-4.388l10.84 18.809L29.44 15a4.221 4.221 0 0 0 0-4.202Zm-2.762 8.984a3.835 3.835 0 0 1-1.817.454 3.877 3.877 0 0 1-3.346-1.936l-9.506-16.49A3.578 3.578 0 0 0 8.877 0a3.579 3.579 0 0 0-3.132 1.812L3.322 6.017a3.837 3.837 0 0 1 1.817-.454c1.375 0 2.657.742 3.346 1.936l9.506 16.49a3.579 3.579 0 0 0 3.132 1.811 3.578 3.578 0 0 0 3.132-1.812l2.423-4.205Z"
            />
          </svg>
        }
        csrfToken={csrfToken}
        providers={providers}
        title={`Log in`}
      />
      <svg
        className="absolute right-[-50%] top-[-80%] -z-10 h-[150vh] w-full text-gray-100"
        viewBox="0 0 835 934"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.9414 293.029L357 892.474C371.593 917.797 398.787 933.525 427.976 933.525H513.692L53.8014 136.559L10.9414 210.931C-3.64713 236.246 -3.64713 267.705 10.9414 293.029Z"
          fill="currentColor"
        />
        <path
          d="M823.21 640.5L477.152 41.0556C462.555 15.7318 435.361 -1.14441e-05 406.175 -1.14441e-05H320.459L780.35 796.966L823.21 722.599C837.803 697.279 837.803 665.82 823.21 640.5Z"
          fill="currentColor"
        />
        <path
          d="M769.268 816.003C758.398 821.823 746.287 824.864 733.782 824.864C706.919 824.864 681.867 810.375 668.406 787.055L234.578 35.3861C221.808 13.2288 198.941 -1.14441e-05 173.398 -1.14441e-05C147.86 -1.14441e-05 124.988 13.2288 112.219 35.3861L64.8855 117.523C75.7598 111.702 87.8708 108.661 100.372 108.661C127.235 108.661 152.287 123.15 165.747 146.475L599.572 898.143C612.341 920.301 635.213 933.529 660.751 933.529C686.29 933.529 709.162 920.301 721.931 898.143L769.268 816.003Z"
          fill="currentColor"
        />
      </svg>
    </Layout>
  )
}

export default LoginPage
