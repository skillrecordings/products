export async function getTranscriptText(audiofile: string) {
  return await fetch(
    `https://castingwords.com/store/API4/audiofile/${audiofile}/transcript.txt?api_key=${process.env.CASTINGWORDS_API_TOKEN}`,
  ).then((transcript) => {
    return transcript.text()
  })
}

export async function getSRTText(audiofile: string) {
  return await fetch(
    `https://castingwords.com/store/API4/audiofile/${audiofile}/transcript.srt?api_key=${process.env.CASTINGWORDS_API_TOKEN}`,
  ).then((srt) => {
    return srt.text()
  })
}

export function buildCastingwordsOrderUrl({
  skus,
  originalMediaUrl,
}: {
  skus: string[]
  originalMediaUrl: string
}) {
  const encodedOriginalMediaUrl = encodeURIComponent(originalMediaUrl)
  const skuParams = (skus: string[]) => {
    const queryParams = skus.map((sku: any) => {
      return `&sku=${sku}`
    })

    return queryParams.join('')
  }
  const developmentTestOrder =
    process.env.NODE_ENV === 'development' ? '&test=1' : ''

  return `https://castingwords.com/store/API4/order_url?api_key=${
    process.env.CASTINGWORDS_API_TOKEN
  }${skuParams(skus)}${developmentTestOrder}&url=${encodedOriginalMediaUrl}`
}

export async function orderTranscript(
  originalMediaUrl: string,
  expedite: boolean = true,
) {
  // BULK2 is a quick transcript order. There is also BULK6 but it is slower
  // BCAPTION3 orders captions
  const skus = [expedite ? 'BULK2' : 'BULK6', 'BCAPTION3']
  const url = buildCastingwordsOrderUrl({skus, originalMediaUrl})
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  return await fetch(url, {
    method: 'POST',
    headers,
  })
}
