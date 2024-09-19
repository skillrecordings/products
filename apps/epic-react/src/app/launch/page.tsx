import RedButton from '@/app/launch/red-button'
import {launch} from '@/app/launch/actions'

export default async function LaunchPage() {
  return (
    <div>
      <form action={launch}>
        <RedButton />
      </form>
    </div>
  )
}
