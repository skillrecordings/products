import EggheadUser from '../components/egghead-user'
import SelectedEmail from '../components/selected-email'
import TokenInput from '../components/token-input'

export default function Home() {
  return (
    <div className="mx-auto flex flex-wrap px-3">
      <SelectedEmail />
      <EggheadUser />
      <TokenInput />
    </div>
  )
}
