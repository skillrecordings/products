import {launchChromium} from 'playwright-aws-lambda'
import {NextApiRequest, NextApiResponse} from 'next'
import Font from '../../components/font'
import twemoji from 'twemoji'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {title, image, byline}: any = req.query
  const browser = await launchChromium()

  const context = await browser.newContext()
  const page = await context.newPage()
  page.setViewportSize({
    width: 1200,
    height: 630,
  })

  const emojify = (text: string) => twemoji.parse(text)
  const logo =
    'https://res.cloudinary.com/dg3gyk0gu/image/fetch/h_176/f_auto/https://badass.dev/assets/skull@2x.png'
  const instructor =
    'https://res.cloudinary.com/pro-tailwind/image/upload/v1659021450/email-course/simon-vrachliotis_pks96n.png'

  const content = `
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Document</title>
</head>
<body>
<link href='https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css' rel='stylesheet'>

<style>
${Font}

body{
  position: relative;
  overflow: hidden;
    margin: 0; 
    padding: 80px 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-items: center;
    width: 1200px;
    height: 630px;
    background-color: rgb(4,3,8);
    font-family: "Greycliff";
    font-weight: 400;
    color: #fff;
    border-bottom: 16px solid #f281a2;
}

.resize{
    display: flex;
    align-items: flex-end;
    text-align: left;
    font-weight: 400;
    width: 100%;
    height: 100%;
    color: #fff;
    line-height: 1.2;
    max-height: 400px;
    margin: 0;
}

.authorName {
  font-size: 80%;
  font-weight: normal;
}

.created{
    position: absolute;
    left: 200px;
    top: 475px;
}


img.emoji {
  height: 1em;
  width: 1em;
  margin: 0 .05em 0 .1em;
  vertical-align: -0.1em;
  display: inline-block;
}
</style>
<div class='flex-shrink-0'>
${image ? `<img src='${image}' width='480' height='480' />` : ''}
</div>
<main class='flex flex-col justify-center h-full w-full pl-8 pb-5'>
  <div class='resize'>
    ${emojify(title)}  
  </div>
  <div class='flex justify-end pt-6'>
    <img src='${logo}' width='${122 / 1.3}' height='${122 / 1.3}' />
  </div>
</main>
<script src='https://unpkg.com/textfit@2.4.0/textFit.js'></script>
<script>
    textFit(document.querySelector('.resize'), { multiLine: true, maxFontSize: 70 });
</script>
</body>
</html>
`.trim()

  await page.setContent(content)

  const screenshotBuffer = await page.screenshot()
  await browser.close()

  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Content-Length', screenshotBuffer.length)
  // download
  // res.setHeader("Content-disposition", "attachment; filename=review@2x.png");
  res.statusCode = 200

  res.send(screenshotBuffer)
}
