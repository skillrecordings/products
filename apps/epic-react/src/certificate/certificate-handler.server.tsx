import {
  getModule,
  getModuleById,
} from '@skillrecordings/skill-lesson/lib/modules'
import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'
import {
  COURSE_CERTIFICATE_PATH,
  EPIC_REACT_COURSE_PRODUCT_ID,
} from './course-certificate'
import {getToken} from 'next-auth/jwt'

const larsseitFont = fetch(
  new URL('../../public/fonts/larsseit.woff', import.meta.url),
).then((res) => res.arrayBuffer())

export default async function handleCreateCertificate(req: NextRequest) {
  const larsseitFontData = await larsseitFont

  try {
    const {searchParams} = new URL(req.url)

    const session = await getToken({req})

    if (!searchParams.has('moduleId') && searchParams.has('productId')) {
      if (searchParams.get('productId') !== EPIC_REACT_COURSE_PRODUCT_ID) {
        return new Response('Invalid course certificate request', {status: 400})
      }
      return new Response(null, {
        status: 307,
        headers: {
          Location: COURSE_CERTIFICATE_PATH,
          'Cache-Control': 'private, no-store',
        },
      })
    }

    const issuedDate = new Date().toLocaleDateString()
    const hasName = searchParams.has('name')
    if (!hasName) {
      return new Response(`Please provide a name`, {
        status: 400,
      })
    }
    const name = hasName ? searchParams.get('name') : session?.name

    // module
    const hasModule = searchParams.has('moduleId')
    const moduleId = searchParams.get('moduleId')
    const module = hasModule ? await getModuleById(moduleId as string) : {}

    if (!hasModule) throw Error

    const ModuleTemplate = () => {
      return (
        <div
          tw="flex w-full relative items-center h-full justify-center"
          style={{
            backgroundColor: '#0A1020',
            backgroundImage: `url('${process.env.NEXT_PUBLIC_URL}/assets/epic-react-certificate-bg.svg')`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* <p
            tw="text-3xl absolute top-18 right-20"
            style={{fontFamily: 'Magnat Text'}}
          >
            Certificate of Completion
          </p> */}
          <div tw="flex flex-col items-center justify-center h-full">
            <img
              src={module.image}
              width={350}
              height={350}
              tw="absolute top-24"
            />
            <div tw="flex flex-col items-center justify-center mt-72">
              <p
                tw="text-7xl leading-none flex pb-10 text-gray-700"
                style={{fontFamily: 'Magnat Head Extrabold'}}
              >
                {name}
              </p>
              <p
                tw="text-center text-2xl font-sans flex"
                style={{fontFamily: 'Larsseit'}}
              >
                Has successfully completed the {module.title} workshop.
              </p>
            </div>
          </div>
          <div
            tw="absolute text-2xl text-right right-16 bottom-24 flex"
            style={{fontFamily: 'Larsseit'}}
          >
            {issuedDate}
          </div>
        </div>
      )
    }

    return new ImageResponse(<ModuleTemplate />, {
      width: 1684,
      height: 1190,
      fonts: [
        {
          name: 'Larsseit',
          data: larsseitFontData,
          style: 'normal',
          weight: 500,
        },
      ],
    })
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the certificate`, {
      status: 500,
    })
  }
}
