import Link from 'next/link'
import {Button} from '@skillrecordings/skill-lesson/ui'
import EditTipForm, {Video} from 'module-builder/edit-tip-form'
import {useRouter} from 'next/router'
import {trpc} from 'trpc/trpc.client'
import TipCreatorLayout from 'module-builder/tip-creator-layout'

const EditTip = () => {
  const router = useRouter()
  const {data: tip} = trpc.tips.bySlug.useQuery({
    slug: router.query.slug as string,
  })

  return tip ? (
    <TipCreatorLayout>
      <header className="pb-2">
        <Button variant="link" className="px-0 py-0 font-semibold" asChild>
          <Link href="/creator/tips">← Tips</Link>
        </Button>
      </header>
      <main className="space-y-4">
        <Video playbackId={tip?.muxPlaybackId} />
        <Button variant="link" className="px-0 py-0 font-semibold" asChild>
          <Link href={`https://epic-web.sanity.studio/desk/tips;${tip?._id}`}>
            Open in Sanity
          </Link>
        </Button>
        <EditTipForm tip={tip} />
      </main>
    </TipCreatorLayout>
  ) : null
}

EditTip.theme = 'light'

export default EditTip
