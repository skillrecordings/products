import {GetServerSideProps} from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: 'https://discord.gg/8S5ujhfTB3',
      permanent: false,
    },
  }
}

export default function Discord() {
  return null
}
