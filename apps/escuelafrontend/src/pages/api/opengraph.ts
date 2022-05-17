import {launchChromium} from 'playwright-aws-lambda'
import {NextApiRequest, NextApiResponse} from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  /* playwright data */
  const {title} = req.query
  const browser = await launchChromium()
  const context = await browser.newContext()
  const page = await context.newPage()

  /* ogImage size */
  page.setViewportSize({
    width: 1200,
    height: 630,
  })

  /*  content */
  const logo = `https://www.laurosilva.com/avatar.png`
  const content = `
  <!DOCTYPE html>
  <html>
     <meta charset="utf-8">
     <title>Generated Image</title>
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
     <style>
        body {
          background: #000;
          margin: 0; 
          padding:0;
          width: 1200px;
          height: 630px;
          justify-content: center;
          align-items: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
     </style>
     <body>
        <div class="grid p-16 py-24">
           <div class="flex justify-between"> 
              <img src="${logo}" class="h-20 w-20" />
           </div>
           <h1 class="resize text-white font-extrabold text-6xl leading-none mt-32 max-w-3xl">${title}</h1>
        </div>
     </body>
  </html>
`.trim()

  /* req */
  await page.setContent(content)
  const screenshotBuffer = await page.screenshot()

  await browser.close()

  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Content-Length', screenshotBuffer.length)
  res.statusCode = 200
  res.send(screenshotBuffer)
}
