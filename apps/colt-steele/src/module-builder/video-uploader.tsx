import * as React from 'react'
import {useFileChange} from './use-file-change'
import {uploadToS3} from './upload-file'

const VideoUploader = () => {
  const {
    fileError,
    fileName,
    fileContents,
    fileType,
    fileDispatch,
    handleFileChange,
  } = useFileChange()
  const [s3FileUrl, setS3FileUrl] = React.useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (fileType && fileContents) {
        const filePath = await uploadToS3({
          fileType,
          fileContents,
          onUploadProgress: (progressEvent) => {
            console.log(
              'progressEvent',
              progressEvent.total
                ? progressEvent.loaded / progressEvent.total
                : 0,
            )
          },
        })

        fileDispatch({type: 'RESET_FILE_STATE'})
        setS3FileUrl(filePath)
      }
    } catch (err) {
      console.log('error is', err)
    }
  }
  return (
    <>
      <div className="w-full">
        <div className="mt-40 flex flex-col items-center justify-center">
          <h1 className="max-w-xl text-3xl">
            Upload files using the input below:
          </h1>
          {fileError && (
            <h1 className="max-w-3xl text-3xl text-red-600">{fileError}</h1>
          )}

          <div>
            <form onSubmit={handleSubmit}>
              <div className="mt-2 flex flex-col items-center">
                <label
                  htmlFor="video"
                  className="mt-6 cursor-pointer rounded-lg border px-5 py-1 shadow hover:bg-purple-900 hover:text-white"
                >
                  <span className="mt-2 text-base leading-normal">
                    {fileName || 'File Input'}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    id="video"
                    name="video"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <button
                  disabled={!fileContents}
                  type="submit"
                  className="my-6 rounded-md border-2 border-green-400 px-1 py-2 hover:bg-purple-900"
                >
                  Upload to s3
                </button>
              </div>
            </form>
            <span className="inline-block h-96 w-96">{s3FileUrl}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default VideoUploader
