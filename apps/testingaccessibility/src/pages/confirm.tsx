import NewMailImage from '../../public/assets/new-mail@2x.png'
import Signature from '../../public/assets/signature@2x.png'
import Layout from 'components/app/layout'
import Image from 'next/image'

const Confirm = () => (
  <Layout
    footer={null}
    meta={{title: 'Confirm your subscription'}}
    className="bg-green-700 bg-noise"
  >
    <main className="flex flex-col flex-grow items-center justify-center pt-5 pb-16 px-5 text-white">
      <div className="flex flex-col max-w-lg mx-auto w-full gap-5 items-center text-center">
        <Image
          priority
          width={460 / 2}
          height={368 / 2}
          quality={100}
          placeholder="blur"
          src={NewMailImage}
          alt=""
          aria-hidden="true"
        />
        <div>
          <p className="sm:text-lg text-sand-100">
            Thanks so much for signing up! There’s one last step.
          </p>
          <h1 className="font-bold lg:text-4xl sm:text-3xl text-2xl py-8 font-aglet-slab">
            Please check your inbox for an email that just got sent.
          </h1>
          <p className="text-sand-100 sm:text-lg leading-relaxed mx-auto pb-8">
            You'll need to click the confirmation link to receive any further
            emails. If you don't see the email after a few minutes, you might
            check your spam folder or other filters and add{' '}
            <strong>marcy@testingaccessibility.com</strong> to your contacts.
          </p>
          <Image
            src={Signature}
            aria-hidden="true"
            alt="Thank you, Marcy"
            width={300 / 2}
            height={164 / 2}
            quality={100}
            priority
          />
        </div>
      </div>
    </main>
  </Layout>
)

export default Confirm
