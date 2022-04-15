import {launchChromium} from 'playwright-aws-lambda'
import {NextApiRequest, NextApiResponse} from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    instructorImage,
    instructorName,
    instructorRole,
    contentType,
    tagImage,
    tagSlug,
    title,
  } = req.query
  const browser = await launchChromium()

  const context = await browser.newContext()
  const page = await context.newPage()
  page.setViewportSize({
    width: 1200,
    height: 630,
  })

  const bannerColor =
    tagSlug == 'react'
      ? `#60dafa`
      : tagSlug == 'javascript'
      ? `#f0db4e`
      : tagSlug == 'typescript'
      ? `#greene`
      : tagSlug == 'npm'
      ? `#purple`
      : tagSlug == 'next-js'
      ? `#brown`
      : null

  const logo = `${process.env.NEXT_PUBLIC_VERCEL_URL}/logo.png`

  const article = `
  <!DOCTYPE html>
  <html>
     <meta charset="utf-8">
     <title>Generated Image</title>
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
     <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital@0;1&family=IBM+Plex+Sans:wght@700&display=swap');
     </style>
     <style>
        body {
          background-image: linear-gradient(#131313, black);
          background-size: cover;                
          background-repeat: no-repeat;
          margin: 0; 
          padding:0;
          width: 1200px;
          height: 630px;
          justify-content: center;
          align-items: center;
          font-family: 'IBM Plex Sans', sans-serif;
        }
        .banner {
          background-color: ${bannerColor};
          position: absolute;
          top: 0px;
          left: 0px;
          z-index: 100;
          height: .75rem;
          width: 100%;
        }
     </style>
     <body>
        <div class="grid p-16 py-24 absolute">
           <div class="flex justify-between"> 
              <img src="${tagImage}" class="h-20 w-20 rounded-sm" />
              <img src="${logo}" class="h-20 w-20" />
           </div>
           <h1 class="resize text-white font-extrabold text-6xl leading-none mt-16">${title}</h1>
           <div class="absolute top-96 left-16 flex items-center gap-4 mt-24">
              <div>
                 <img src="${instructorImage}" class="h-20 w-20 rounded-full" />
              </div>
              <p class="text-white font-semibold text-2xl leading-tighter font-sans">${instructorName}</p>
           </div>
        </div>
        <div class="banner"></div>
     </body>
  </html>
`.trim()

  const profile = `
  <!DOCTYPE html>
  <html>
     <meta charset="utf-8">
     <title>Generated Image</title>
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
     <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital@0;1&family=IBM+Plex+Sans:wght@700&display=swap');
     </style>
     <style>
        body {
          background-image: linear-gradient(#131313, black);
          background-size: cover;                
          background-repeat: no-repeat;
          margin: 0; 
          padding:0;
          width: 1200px;
          height: 630px;
          justify-content: center;
          align-items: center;
          font-family: 'IBM Plex Sans', sans-serif;
        }
        .banner {
          background-color: ${bannerColor};
          position: absolute;
          top: 0px;
          left: 0px;
          z-index: 100;
          height: .75rem;
          width: 100%;
        }
        .text-color {
          color: ${bannerColor};
        }
     </style>
     <body>
        <div class="px-16 py-24 absolute">
          <div class="grid grid-cols-10 gap-10">
            <div class=" col-span-6">
              <div class="flex items-center gap-6 w-full">
              <img src="${logo}" class="h-20 w-20" />
              </div>
              <div class="mt-24">
                <h1 class="resize text-white font-extrabold text-6xl leading-none mb-2">${instructorName}</h1>
                <p class="text-color font-medium text-3xl font-sans">${instructorRole}<p>
              </div>
            </div>
            <div class=" col-span-4">
             <img src="${instructorImage}" class="h-330 w-330 rounded-md" />
            </div>
          </div>
        </div>
        <div class="banner"></div>
     </body>
  </html>
`.trim()

  const course = `
  <!DOCTYPE html>
<html>
   <meta charset="utf-8">
   <title>Generated Image</title>
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
   <style>
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital@0;1&family=IBM+Plex+Sans:wght@700&display=swap');
   </style>
   <style>
      body {
        background-image: linear-gradient(#131313, black);
        background-size: cover;                
        background-repeat: no-repeat;
        margin: 0; 
        padding:0;
        width: 1200px;
        height: 630px;
        justify-content: center;
        align-items: center;
        font-family: 'IBM Plex Sans', sans-serif;
      }
      .banner {
        background-color: ${bannerColor};
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 100;
        height: .75rem;
        width: 100%;
      }
   </style>
   <body>
      <div class="grid p-16 absolute">
         <div class="flex justify-between"> 
            <img src="${tagImage}" class="h-20 w-20" />
            <img src="${logo}" class="h-20 w-20" />
         </div>
         <h1 class="resize text-white font-extrabold text-6xl leading-none mt-24">${title}</h1>
         <div class="absolute top-96 left-16 flex items-center gap-4 mt-24">
            <div>
               <img src="${instructorImage}" class="h-20 w-20 rounded-full" />
            </div>
            <p class="text-white font-bold text-2xl leading-tighter">${instructorName}</p>
         </div>
      </div>
      <div class="banner"></div>
   </body>
</html>
`.trim()

  await page.setContent(
    contentType == 'article'
      ? article
      : contentType == 'profile'
      ? profile
      : contentType == 'course'
      ? course
      : course,
  )

  const screenshotBuffer = await page.screenshot()
  await browser.close()

  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Content-Length', screenshotBuffer.length)
  res.statusCode = 200

  res.send(screenshotBuffer)
}
