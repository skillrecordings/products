import {getTip} from 'lib/tips'
import Link from 'next/link'
import {Button} from '@skillrecordings/skill-lesson/ui'
import EditTipForm, {Video} from 'module-builder/edit-tip-form'
import MuxPlayer from '@mux/mux-player-react'

const EditTip = async ({params}: {params: {slug: string}}) => {
  const tip = await getTip(params.slug)

  return (
    <>
      <header className="pb-2">
        <Button variant="link" className="px-0 py-0 font-semibold" asChild>
          <Link href="/creator/tips">← Tips</Link>
        </Button>
      </header>
      <main className="space-y-4">
        <Video playbackId={tip.muxPlaybackId} />
        <EditTipForm tip={tip} />
      </main>
    </>
  )
}

export default EditTip
