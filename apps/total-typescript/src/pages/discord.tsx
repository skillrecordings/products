import {GetServerSideProps} from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL,
      permanent: false,
    },
  }
}

export default function Discord() {
  return null
}
