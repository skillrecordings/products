import {fetchBase64Image} from 'utils/fetch-base64-image'
import {NextApiRequest, NextApiResponse} from 'next'
import {SVG, registerWindow} from '@svgdotjs/svg.js'
import {SanityDocument} from '@sanity/client'
import {createSVGWindow} from 'svgdom'
import PDFDocument from 'pdfkit-next'
import SVGtoPDF from 'svg-to-pdfkit'
import toUpper from 'lodash/toUpper'
import path from 'path'
import fs from 'fs'

const backgroundPath = path.resolve(
  './public/assets/certificate-background.svg',
)
const background = fs.readFileSync(backgroundPath).toString('utf-8')

export async function drawModuleCertificatePdf(
  req: NextApiRequest,
  res: NextApiResponse,
  sessionToken: any,
  module: SanityDocument,
) {
  const {slug} = req.query
  const window = createSVGWindow()
  const document = window.document
  registerWindow(window, document)
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4',
  })
  const canvas: any = SVG(document.documentElement)
  SVGtoPDF(doc, background)

  const moduleImage = await fetchBase64Image(module.image.url)
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
    .text(toUpper(`Has successfully completed Testing Accessibility workshops`))
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
}
