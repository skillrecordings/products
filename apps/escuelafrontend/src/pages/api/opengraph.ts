import {launchChromium} from 'playwright-aws-lambda'
import {NextApiRequest, NextApiResponse} from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {title, contentType, tagImage, authorImage, authorName, tagSlug} =
    req.query
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
          <div class="grid p-16 absolute">
           <div class="flex justify-between"> 
            <img src="${tagImage}" class="h-20 w-20" />
            <img src="${logo}" class="h-20 w-20" />
           </div>
            <h1 class="resize text-white font-extrabold text-6xl leading-none mt-24">${title}</h1>   
           <div class="absolute top-96 left-16 flex items-center gap-4 mt-24">
            <div>
              <img src="${authorImage}" class="h-20 w-20 rounded-full" />
            </div>
            <p class="text-white font-bold text-2xl leading-tighter">${authorName}</p>  
           </div>
          </div>
          <div class="banner"></div>
      </body>
  </html>
`.trim()

  const profile = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<style>
   
</style>
<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">


<style>
body{
    margin: 0; 
    padding:0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1200px;
    height: 630px;
    background-color: #000;
    font-family: 'Articulat', sans-serif;
}

.resize{
    position: absolute;
    top: 135px;
    left: 100px;
    position: absolute;
    width: 700px;
    height: 130px;
    color: #ffffff;
    line-height: 1.1;
}

.avatar{
    // position: absolute;
    // left: 75px;
    // top: 474px;
}

.created{
    position: absolute;
    left: 200px;
    top: 475px;
}

.author{
    // position: absolute;
    // left: 200px;
    // top: 510px;
}

.logo{
  position: absolute;
  right: 100px;
  top: 100px;
}

</style>
<img src="${logo}" class="logo" />

}

<script src="https://unpkg.com/textfit@2.4.0/textFit.js"></script>
<script>
    textFit(document.querySelector('.resize'), { multiLine: true})
</script>
</body>
</html>
`.trim()

  const course = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<style>
@font-face {
  font-family: 'IBM Plex Sans';
  font-style: italic;
  font-weight: 100 900;
  font-display: optional;
  src: url('/fonts/ibm-plex-sans-var-italic.woff2') format('woff2');
}

</style>
<style>
body{
  margin: 0; 
  padding:0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1200px;
  height: 630px;
  background-color: #000;
  font-family: 'IBM Plex Sans', sans-serif;
}

</style>
<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">

<style>
body{
    margin: 0; 
    padding:0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1200px;
    height: 630px;
    background-color: #000;
    font-family: 'Articulat', sans-serif;
}

.resize{
    position: absolute;
    top: 135px;
    left: 100px;
    position: absolute;
    width: 700px;
    height: 130px;
    color: #ffffff;
    line-height: 1.1;
}

.avatar{
    // position: absolute;
    // left: 75px;
    // top: 474px;
}

.created{
    position: absolute;
    left: 200px;
    top: 475px;
}

.author{
    // position: absolute;
    // left: 200px;
    // top: 510px;
}

.logo{
  position: absolute;
  right: 100px;
  top: 100px;
}

</style>
<img src="${logo}" class="" />
<div class="resize">course</div>


<script src="https://unpkg.com/textfit@2.4.0/textFit.js"></script>
<script>
    textFit(document.querySelector('.resize'), { multiLine: true})
</script>
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
