// @ts-nocheck
import {getModule} from '@skillrecordings/skill-lesson/lib/modules'
import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'
import {getProduct} from 'path-to-purchase-react/products.server'

const magnatHeadFont = fetch(
  new URL(
    '../../public/fonts/6fecec1e-f4a1-49a8-8eb2-d3215d7a594e.woff',
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

const magnatHeadExtraBoldFont = fetch(
  new URL(
    '../../public/fonts/d6c82f9e-b1c6-42e4-8ba7-b08485ad4122.woff',
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

const magnatTextFont = fetch(
  new URL(
    '../../public/fonts/d5963985-9426-4ddd-9ee9-e0519f89608a.woff',
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

const larsseitFont = fetch(
  new URL(
    '../../public/fonts/d9275214-bcba-4615-a78a-9a15740d63ad.woff',
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

export default async function handleCreateCertificate(req: NextRequest) {
  const magnatHeadFontData = await magnatHeadFont
  const magnatTextFontData = await magnatTextFont
  const magnatHeadExtraBoldFontData = await magnatHeadExtraBoldFont
  const larsseitFontData = await larsseitFont

  try {
    const {searchParams} = new URL(req.url)

    const issuedDate = new Date().toLocaleDateString()
    const hasName = searchParams.has('name')
    const name = hasName ? searchParams.get('name') : 'Your Name'

    // module
    const hasModule = searchParams.has('module')
    const moduleSlug = searchParams.get('module')
    const module = hasModule ? await getModule(moduleSlug as string) : {}

    // product
    const hasProduct = searchParams.has('product')
    const productSlug = searchParams.get('product')
    const productData = hasProduct
      ? await getProduct(productSlug as string)
      : {}

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
        'https://res.cloudinary.com/total-typescript/image/upload/v1675963540/certificate-module-background_2x_j6ahni.png'

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
          <div tw="flex flex-col items-center justify-center h-full">
            <img
              src={module.image}
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
        'https://res.cloudinary.com/total-typescript/image/upload/v1676026919/certificate-product-background_2x_czijep.png'

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
          name: 'Magnat Head Extrabold',
          data: magnatHeadExtraBoldFontData,
          style: 'normal',
          weight: 800,
        },
        {
          name: 'Magnat Head',
          data: magnatHeadFontData,
          style: 'normal',
          weight: 600,
        },
        {
          name: 'Magnat Text',
          data: magnatTextFontData,
          style: 'normal',
          weight: 300,
        },
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
