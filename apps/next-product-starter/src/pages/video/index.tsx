const Page = () => {
  return <div />
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/video/supabase-create-a-new-supabase-project',
      permanent: false,
    },
  }
}

export default Page
