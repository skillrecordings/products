import {NextApiRequest, NextApiResponse} from 'next'
import {getPurchasedProduct} from 'server/get-purchased-product'
import {getModuleProgressForUser} from 'utils/progress'
import {find, flatten, isEmpty, toUpper} from 'lodash'
import {serialize} from 'utils/prisma-next-serializer'
import {SVG, registerWindow} from '@svgdotjs/svg.js'
import {setupHttpTracing} from '@vercel/tracing-js'
import {sanityClient} from 'utils/sanity-client'
import {SanityDocument} from '@sanity/client'
import {tracer} from 'utils/honeycomb-tracer'
import {withSentry} from '@sentry/nextjs'
import {createSVGWindow} from 'svgdom'
import {getToken} from 'next-auth/jwt'
import * as Sentry from '@sentry/nextjs'
import PDFDocument from 'pdfkit-next'
import SVGtoPDF from 'svg-to-pdfkit'
import prisma from 'db'
import groq from 'groq'
import path from 'path'
import fs from 'fs'

const generateModuleCertificate = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  setupHttpTracing({
    name: generateModuleCertificate.name,
    tracer,
    req,
    res,
  })
  const sessionToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  if (req.method === 'GET') {
    try {
      if (!sessionToken || !sessionToken.sub) {
        return res.status(403).end('Not Authorized')
      }

      const {product} = await getPurchasedProduct(req)
      const {slug} = req.query

      // get available modules
      const modules: {slug: string}[] = flatten(
        product.modules.map((module: SanityDocument) => module),
      )

      // determine current module from slug
      const currentModuleSlug: {slug: string} | undefined = find(modules, {
        slug: slug as string,
      })

      const allModules = await sanityClient.fetch(allModulesQuery)

      // if the module doesn't exist
      if (isEmpty(find(allModules, {slug: slug}))) {
        return res.status(403).end('Module not found')
      }

      // if the module is not found, they are trying to access module that is not included in their purchase
      if (isEmpty(currentModuleSlug)) {
        return res.status(403).end('Not Authorized')
      }

      // finally get current module
      const module = await sanityClient.fetch(moduleQuery, {
        slug: currentModuleSlug?.slug,
      })

      // check user progress
      const userLessonProgress = await prisma.lessonProgress.findMany({
        where: {
          userId: sessionToken.sub,
        },
      })

      const progress = userLessonProgress.map(serialize)

      const {isCompleted} = getModuleProgressForUser(progress, module.sections)

      if (!isCompleted) {
        return res
          .status(403)
          .end(`You must complete the module in order to get a certificate.`)
      }

      // draw a pdf

      const window = createSVGWindow()
      const document = window.document
      registerWindow(window, document)
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
      })
      const canvas: any = SVG(document.documentElement)
      SVGtoPDF(doc, background)

      const moduleImage = await fetchImage(module.image.url)
      const imageSVG = canvas
        .image(moduleImage)
        .width(320)
        .height(320)
        .attr('x', '36%')
        .attr('y', '6%')

      const userName = req.query.name || sessionToken.name || ''
      const nameSVG = canvas
        .text(userName)
        .attr('font-size', 36)
        .attr('x', '50%')
        .attr('y', '66%')
        .attr('text-anchor', 'middle')
        .fill('#000')

      const completedEverythingSVG = canvas
        .text(
          toUpper(`Has successfully completed Testing Accessibility workshops`),
        )
        .attr('font-size', 18)
        .attr('x', '50%')
        .attr('y', '74%')
        .attr('text-anchor', 'middle')
        .fill('#000')

      const completedModuleSVG = canvas
        .text(toUpper(`Has successfully completed`))
        .attr('font-size', 18)
        .attr('x', '50%')
        .attr('y', '74%')
        .attr('text-anchor', 'middle')
        .fill('#000')

      const completedModuleRestSVG = canvas
        .text(toUpper(`the ${module.title} workshop`))
        .attr('font-size', 18)
        .attr('x', '50%')
        .attr('y', '77%')
        .attr('text-anchor', 'middle')
        .fill('#000')

      // default font doesnt support all characters so we need to load a custom one
      SVGtoPDF(doc, nameSVG.svg(), 0, 0, {
        fontCallback: () => path.resolve('./public/fonts/Inter-Bold.otf'),
      })

      if (slug) {
        SVGtoPDF(doc, imageSVG.svg(), 0, 0)
        SVGtoPDF(doc, completedModuleSVG.svg(), 0, 0)
        SVGtoPDF(doc, completedModuleRestSVG.svg(), 0, 0)
      } else {
        SVGtoPDF(doc, completedEverythingSVG.svg(), 0, 0)
      }

      res.setHeader(
        'Content-disposition',
        "attachment; filename*=UTF-8''" +
          `Testing Accessibility Certificate - ${encodeURI(
            userName as string,
          )}.pdf`,
      )
      res.setHeader('Content-type', 'application/pdf; charset=UTF-8')
      doc.pipe(res)
      doc.end()
    } catch (error: any) {
      Sentry.captureException(error)
      res.status(500).json({error: true, message: error.message})
    }
  } else {
    console.error('non-get request made')
    res.status(404).end()
  }
}

export default withSentry(generateModuleCertificate)

export const config = {
  api: {
    externalResolver: true,
  },
}

const backgroundPath = path.resolve(
  './public/assets/certificate-background.svg',
)
const background = fs.readFileSync(backgroundPath).toString('utf-8')

const allModulesQuery = groq`*[_type == "module"]{
    "slug": slug.current
}`

const moduleQuery = groq`*[_type == "module" && slug.current == $slug][0]{
title,
"slug": slug.current,
image {
    url
},
sections[]->{
      title,
      "slug": slug.current,
      lessons[]->{
        title,
        "slug": slug.current
      }
}
}`

const fetchImage = async (src: string) => {
  const response: any = await fetch(src).then((res) => res)
  const image = await response.buffer()
  return 'data:image/png;base64,' + image.toString('base64')
}
