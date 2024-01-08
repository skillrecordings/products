import React from 'react'
import Layout from '@/components/app/layout'
import config from '@/config'
import Container from '@/components/app/container'
import Balancer from 'react-wrap-balancer'
import {Annotation} from '@/components/annotation'

const ConfirmSubscriptionPage = () => {
  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <Container
        as="main"
        className="flex min-h-[calc(100svh-80px)] flex-grow flex-col items-center justify-center px-5"
      >
        <Image />
        <div className="max-w-screen-sm text-center font-light">
          <p className="text-lg text-primary">
            Thanks so much for signing up! There’s one last step.
          </p>
          <h1 className="font-normall py-10 font-sans text-3xl lg:text-4xl lg:leading-tight">
            <Balancer>
              Please{' '}
              <Annotation
                options={{
                  type: 'highlight',
                  color: 'rgba(185,248,215,0.15)',
                }}
              >
                check your inbox
              </Annotation>{' '}
              for an email that just got sent and{' '}
              <Annotation
                options={{
                  type: 'highlight',
                  color: 'rgba(185,248,215,0.15)',
                  animationDelay: 800,
                  animationDuration: 1500,
                }}
              >
                click the confirmation link.
              </Annotation>
            </Balancer>
          </h1>

          <p className="mx-auto pb-8 text-sm leading-relaxed text-gray-300 sm:text-base">
            You'll need to <strong>click the confirmation link</strong> to
            receive any further emails. If you don't see the email after a few
            minutes, you might check your spam folder or other filters and add{' '}
            <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> to your
            contacts.
          </p>
          <p className="text-sm text-gray-300 sm:text-base">
            <Signature />
          </p>
        </div>
      </Container>
    </Layout>
  )
}

export default ConfirmSubscriptionPage

export const Signature = () => {
  //TODO: add a signature
  return (
    <>
      <svg
        className="mx-auto"
        width="196"
        height="108"
        viewBox="0 0 196 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M89.6364 42.4156C79.5474 45.5125 69.5325 49.0149 59 51.0426C59.2587 49.6048 60.4412 49.6418 61.2173 49.3837C73.6715 45.3651 86.1627 41.42 98.617 37.4382C101.832 36.4059 105.01 35.2632 108.226 34.1941C109.26 33.8622 109.925 33.1985 110.443 32.203C111.182 30.802 111.774 29.2904 113.104 28C113.511 29.4379 112.697 30.3228 112.402 31.3182C112.291 31.65 111.921 31.9451 112.254 32.3137C112.549 32.6087 112.919 32.4612 113.289 32.3137C115.173 31.5395 117.021 30.8021 119.201 29.9172C118.499 31.6869 117.058 32.1662 115.839 32.4611C111.626 33.5672 109.593 36.4798 108.115 40.351C106.415 44.812 104.16 49.0518 102.128 53.4022C101.647 54.4345 101.241 55.1719 102.498 56.1304C103.421 56.8309 103.791 58.2319 104.345 59.338C105.085 60.8127 106.119 61.1446 107.598 60.4073C110.591 58.9694 113.104 56.9785 114.619 53.9553C114.841 53.5129 115.063 53.0337 115.358 52.5912C115.728 52.0751 116.097 51.2272 116.873 51.7064C117.575 52.112 116.873 52.7387 116.689 53.2179C115.321 56.2411 115.913 57.0891 119.165 56.8679C122.306 56.6466 124.708 54.6189 127.554 53.6234C128.071 53.4391 127.923 52.8861 127.96 52.4805C128.219 50.1578 130.51 48.6094 130.436 46.1024C130.436 45.7337 131.951 45.3281 132.765 45.5862C135.647 46.5816 136.793 49.31 135.425 51.9276C134.427 53.8079 132.838 55.1351 130.806 55.7988C130.067 56.0568 128.958 56.2411 128.551 55.5037C127.701 53.9553 126.962 54.7665 126.149 55.3933C124.154 56.9049 121.973 58.0845 119.46 58.6744C117.76 59.0799 116.208 59.043 114.952 57.7158C114.102 56.794 113.695 57.5315 113.215 58.0477C111.81 59.5593 110.295 60.9972 108.373 61.8452C105.565 63.1356 103.976 62.4719 102.682 59.7068C102.202 58.6745 102.165 57.4209 101.13 56.4624C99.7998 58.232 99.282 60.2966 98.395 62.1769C97.545 64.0572 96.8433 65.9743 96.0672 67.8914C95.8824 68.3338 95.8081 69.1081 95.1799 68.8869C94.3668 68.592 94.8476 67.9283 95.0323 67.4121C96.7323 61.9556 98.8389 56.6098 101.13 51.3745C103.126 46.8029 105.343 42.3049 107.45 37.7702C107.671 37.2909 108.336 36.7748 107.782 36.2218C107.376 35.8162 106.821 36.2586 106.341 36.443C102.128 37.9546 97.878 39.466 93.665 40.9408C92.5563 41.3095 91.8908 41.8625 91.4842 43.0792C87.6408 55.2088 83.6867 67.3015 79.7324 79.3943C79.5107 80.0579 79.5474 81.1639 78.5865 80.9796C77.4409 80.7584 77.9583 79.6892 78.1431 78.9519C80.8409 66.9697 84.6474 55.2824 89.2669 43.8902C89.4517 43.4478 89.9325 43.0791 89.5999 42.3049L89.6364 42.4156ZM134.686 49.4204C134.76 48.3512 134.243 47.5034 133.06 47.0241C132.469 46.766 132.136 46.8397 131.841 47.4296C130.917 49.1624 130.03 50.9322 129.438 52.8124C129.106 53.8816 129.55 54.324 130.658 54.1765C132.58 53.9185 134.686 51.5219 134.686 49.4204Z"
          className="text-gray-300 dark:text-gray-700"
          fill="currentColor"
        />
      </svg>
    </>
  )
}

const Image = () => {
  //TODO: add an image
  return null
}
