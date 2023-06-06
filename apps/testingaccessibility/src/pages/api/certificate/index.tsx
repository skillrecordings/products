import {ImageResponse} from '@vercel/og'
import groq from 'groq'
import {getToken} from 'next-auth/jwt'
import {NextRequest} from 'next/server'
import {sanityClient} from 'utils/sanity-client'

const agletSlabSemiboldFont = fetch(
  new URL('../../../../public/fonts/AgletSlab-SemiBold.woff', import.meta.url),
).then((res) => res.arrayBuffer())

const agletSansRegularFont = fetch(
  new URL('../../../../public/fonts/AgletSans-Regular.woff', import.meta.url),
).then((res) => res.arrayBuffer())

export const config = {
  runtime: 'edge',
}

const width = 1264 * 1.5
const height = 894 * 1.5

export default async function handleCreateCertificate(req: NextRequest) {
  const agletSlabSemiboldFontData = await agletSlabSemiboldFont
  const agletSansRegularFontData = await agletSansRegularFont

  async function getModule(slug: string) {
    return await sanityClient.fetch(
      groq`*[_type == "module" && slug.current == $slug][0]{
        title,
        "slug": slug.current,
        "image": image.url,
        }`,
      {
        slug,
      },
    )
  }
  const sessionToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  try {
    const {searchParams} = new URL(req.url)

    if (!sessionToken || !sessionToken.sub) {
      throw Error
    }

    const issuedDate = new Date().toLocaleDateString()
    const hasName = searchParams.has('name')
    const name = hasName ? searchParams.get('name') : 'Your Name'

    // module
    const hasModule = searchParams.has('module')
    const moduleSlug = searchParams.get('module')
    const module = hasModule ? await getModule(moduleSlug as string) : {}
    console.log({module})

    const getCertificate = () => {
      switch (true) {
        case hasModule:
          return <ModuleTemplate />
          break

        default:
          throw Error
      }
    }

    const ModuleTemplate = () => {
      return (
        <div
          tw="bg-[#21452E] flex flex-col text-center items-center justify-center relative w-full h-full text-white"
          style={{fontFamily: 'Aglet Sans'}}
        >
          {module?.image && (
            <img
              src={module.image}
              width={540}
              height={540}
              tw="mx-auto -mt-40"
            />
          )}
          <h1
            tw="flex flex-row text-8xl text-white pb-2"
            style={{fontFamily: 'Aglet Slab'}}
          >
            Certificate of Completion
          </h1>
          {hasName && (
            <h2 tw="my-16 text-7xl w-full border-b border-white/10 max-w-2xl overflow-visible flex items-center justify-center text-center px-5 pb-8">
              {name}
            </h2>
          )}
          <p tw="text-4xl pb-10 pt-4 max-w-4xl text-center mx-auto leading-normal text-white/80">
            Has succesfully completed{' '}
            {module?.title
              ? `the ${module.title} workshop.`
              : `all the Testing Accessibility workshops.`}
          </p>
          <div tw="flex items-center justify-center absolute left-24 bottom-24">
            <img
              src="https://res.cloudinary.com/testing-accessibility/image/upload/v1686058341/logo-white-wide_2x_pip8ny.png"
              width={445}
              height={68}
            />
          </div>
          <div tw="flex items-center justify-center absolute right-24 bottom-24">
            <img
              src={`https://res.cloudinary.com/testing-accessibility/image/upload/v1686057443/signature_ihy3bp.png`}
              width={325}
              height={57}
              alt="Marcy Sutton"
            />
          </div>
          <time tw="text-2xl absolute bottom-16 text-white/60 right-24">
            {issuedDate}
          </time>
        </div>
      )
    }

    return new ImageResponse(getCertificate(), {
      width,
      height,
      fonts: [
        {
          name: 'Aglet Slab',
          data: agletSlabSemiboldFontData,
          style: 'normal',
          weight: 500,
        },
        {
          name: 'Aglet Sans',
          data: agletSansRegularFontData,
          style: 'normal',
          weight: 300,
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
