import axios from 'axios'
import uuid from 'shortid'
import fileExtension from 'file-extension'

const SIGNING_URL = `/api/aws/sign-s3`

export async function uploadToS3({
  fileType,
  fileContents,
  onUploadProgress = () => {},
}: {
  fileType: string
  fileContents: File
  onUploadProgress: (progressEvent: {loaded: number; total?: number}) => void
}) {
  const presignedPostUrl = await getPresignedPostUrl(
    fileType,
    fileContents.name,
  )

  console.log('presignedPostUrl', presignedPostUrl)

  await axios.put(presignedPostUrl.signedUrl, fileContents, {
    headers: {'Content-Type': 'application/octet-stream'},
    onUploadProgress,
  })

  return presignedPostUrl.publicUrl
}

type PresignedPostUrlResponse = {
  signedUrl: string
  publicUrl: string
  filename: string
  objectName: string
}

const prepareFileName = (fullFilename: string) => {
  // filename with no extension
  const filename = fullFilename.replace(/\.[^/.]+$/, '')
  // remove stuff s3 hates
  const scrubbed = `${filename}-${uuid.generate()}`
    .replace(/[^\w\d_\-.]+/gi, '')
    .toLowerCase()
  // rebuild it as a fresh new thing
  return `${scrubbed}.${fileExtension(fullFilename)}`
}

async function getPresignedPostUrl(fileType: string, fileName: string) {
  const {data: presignedPostUrl} = await axios.get<PresignedPostUrlResponse>(
    `${SIGNING_URL}?contentType=${fileType}&objectName=${prepareFileName(
      fileName,
    )}`,
  )

  return presignedPostUrl
}
