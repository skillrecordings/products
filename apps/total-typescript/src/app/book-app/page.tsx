import {Button} from '@skillrecordings/ui/primitives/button'
import Link from 'next/link'
import {getBook} from '@/lib/book'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'
import {ChaptersIndex} from './_components/chapters-index'
import Heading from '@/components/heading'

const BookRoute = async () => {
  return (
    <div>
      <Heading
        title="TypeScript Essentials"
        description="Everything you need to know to get really good at TypeScript"
      />
      <div className="mx-auto flex w-full max-w-screen-lg gap-16 py-16">
        {/* <div className="flex items-center gap-2">
        <Button asChild>
        <Link href="">Buy the print edition</Link>
        </Button>
        <Button asChild variant="secondary">
        <Link href={`/book/${book.chapters[0].slug.current}`}>
        Continue from where you left off
        </Link>
        </Button>
      </div> */}
        <article className="prose prose-invert max-w-xl sm:prose-lg">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus
            diam in nulla semper, a egestas enim dapibus. Aliquam varius feugiat
            lectus, sed iaculis dui bibendum sit amet. Aliquam semper, nibh
            vitae elementum rutrum, nibh enim tempor eros, in ultricies lorem
            purus nec nibh. Suspendisse ac auctor metus, id cursus augue. Ut
            tincidunt odio sit amet nunc commodo pellentesque. Aenean
            pellentesque augue condimentum nisi tempor aliquet at sed mauris.
            Integer bibendum pretium ligula, ut pharetra ex vestibulum id. Morbi
            purus dolor, feugiat quis rhoncus sed, congue at felis. Etiam urna
            felis, elementum in quam id, congue venenatis orci. Quisque molestie
            diam eu arcu mattis cursus. Aliquam leo sapien, efficitur at ante
            id, mattis imperdiet elit. Nam sagittis, metus ut malesuada
            tincidunt, risus leo malesuada turpis, vel placerat dolor odio at
            metus. Donec diam velit, posuere in sollicitudin non, ornare ut ex.
            Cras a mi in turpis luctus iaculis nec non nulla. Sed in velit quis
            felis consequat tempor. Aliquam iaculis ex sed nisl aliquam
            condimentum.
          </p>
          <p>
            Proin imperdiet nunc sit amet dui condimentum, eget sagittis turpis
            vulputate. Pellentesque nec est id elit porttitor posuere ac et
            lacus. Nulla ac velit at nisl venenatis accumsan. Etiam mattis ipsum
            vel ligula fermentum bibendum. Donec vitae mi viverra, varius tortor
            a, commodo dui. Sed lobortis finibus velit eget gravida. Proin id
            justo vitae elit imperdiet mollis.
          </p>
          <p>
            Aenean vel interdum turpis. In mauris lacus, ultrices in lectus sed,
            pulvinar sollicitudin sapien. Vivamus lacinia odio eget vulputate
            ultricies. Quisque hendrerit nulla purus, eu vestibulum urna feugiat
            quis. Ut ac luctus velit, at maximus mauris. Aenean tempor, nisl
            vitae bibendum maximus, lorem quam pharetra massa, sed fringilla
            purus magna at nulla. Curabitur rutrum arcu diam, eu congue tellus
            efficitur et.
          </p>
          <p>
            Vivamus ut libero varius, mollis risus in, ornare neque. Nullam ac
            mi in ex iaculis efficitur a eget augue. Ut at lectus vel felis
            consequat venenatis molestie ut lorem. Nam ut justo in sapien mattis
            maximus at et dui. Aenean nec congue tortor, in tincidunt quam. Ut
            interdum mi velit. Nulla fringilla diam vitae erat maximus, non
            hendrerit dolor pharetra. Ut ut elementum lacus. Aliquam ac augue
            est. Duis dignissim, lorem vitae suscipit volutpat, lacus turpis
            luctus justo, auctor finibus dolor libero quis nisl. In eget varius
            ante. Donec interdum justo eget laoreet tempor. Sed finibus lorem eu
            purus viverra, id facilisis sem cursus.
          </p>
        </article>
        <div className="flex w-full flex-col gap-3">
          <h3 className="text-2xl font-semibold">Contents</h3>
          <ul className="flex flex-col gap-4 text-left">
            <ChaptersIndex />
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BookRoute
