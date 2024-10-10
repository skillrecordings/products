export async function getServerSideProps() {
  return {
    redirect: {
      destination: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL,
      permanent: true,
    },
  }
}

export default function DiscordRedirect() {
  return <div>Redirecting...</div>
}
