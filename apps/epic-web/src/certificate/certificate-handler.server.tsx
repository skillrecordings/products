import {
  getModule,
  getModuleById,
} from '@skillrecordings/skill-lesson/lib/modules'
import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'
import {getProduct} from '@skillrecordings/skill-lesson/path-to-purchase/products.server'
import {getToken} from 'next-auth/jwt'

const larsseitFont = fetch(
  new URL(
    '../../public/fonts/d9275214-bcba-4615-a78a-9a15740d63ad.woff',
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

export default async function handleCreateCertificate(req: NextRequest) {
  const larsseitFontData = await larsseitFont

  try {
    const {searchParams} = new URL(req.url)

    const session = await getToken({req})

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

    // product
    const hasProduct = searchParams.has('productId')
    const productId = searchParams.get('productId')
    const productData = hasProduct ? await getProduct(productId as string) : {}

    const getCertificate = () => {
      switch (true) {
        case hasModule:
          return <ModuleTemplate />
          break
        case hasProduct:
          return <ProductTemplate />
          break
        default:
          throw Error
      }
    }

    const ModuleTemplate = () => {
      const backgroundImage =
        'https://res.cloudinary.com/epic-web/image/upload/v1695817673/certificate-background.jpg'

      return (
        <div
          tw="flex w-full relative text-white items-center h-full justify-center"
          style={{
            backgroundColor: '#0A1020',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <p
            tw="text-3xl absolute top-18 right-20"
            style={{fontFamily: 'Magnat Text'}}
          >
            Certificate of Completion
          </p>
          <div tw="flex flex-col items-center justify-center h-full">
            <img
              src={module.image}
              width={550}
              height={550}
              tw="absolute top-24"
            />
            <div tw="flex flex-col items-center justify-center mt-72">
              <p
                tw="text-7xl leading-none flex pb-10"
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
            tw="absolute text-2xl text-right right-16 bottom-16 flex"
            style={{fontFamily: 'Larsseit'}}
          >
            {issuedDate}
          </div>
        </div>
      )
    }

    const ProductTemplate = () => {
      const backgroundImage =
        'https://res.cloudinary.com/epic-web/image/upload/v1695817673/certificate-background.jpg'

      return (
        <div
          tw="flex w-full relative text-white items-center h-full justify-center"
          style={{
            backgroundColor: '#080B16',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div tw="flex flex-col items-center justify-center h-full">
            <img
              src={productData.image.url}
              width={550}
              height={550}
              tw="absolute top-24"
            />
            <div tw="flex flex-col items-center justify-center mt-96">
              <p tw="text-4xl flex pt-10" style={{fontFamily: 'Magnat Text'}}>
                Certificate of Completion
              </p>
              <p
                tw="text-7xl leading-none flex pb-10"
                style={{fontFamily: 'Magnat Head Extrabold'}}
              >
                {name}
              </p>
              <p
                tw="text-center text-2xl font-sans flex"
                style={{fontFamily: 'Larsseit'}}
              >
                Has successfully completed all of the Total TypeScript{' '}
                {productData.name} workshops.
              </p>
            </div>
          </div>
          <div
            tw="absolute text-2xl text-right right-16 bottom-16 flex"
            style={{fontFamily: 'Larsseit'}}
          >
            {issuedDate}
          </div>
        </div>
      )
    }

    return new ImageResponse(getCertificate(), {
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
