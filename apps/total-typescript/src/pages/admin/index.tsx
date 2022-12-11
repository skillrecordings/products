import Layout from 'components/app/layout'
import {Formik, Form, Field, FormikProps} from 'formik'
import * as React from 'react'
import VideoUploader from 'module-builder/video-uploader'
import useFileUploadReducer from 'module-builder/use-file-upload-reducer'

export default function Adminpage() {
  const initialValues = {
    course: {
      title: '',
      collaboratorId: undefined,
      topicIds: [],
    },
    lessons: [],
  }
  const [fileUploadState, dispatch] = useFileUploadReducer([])
  console.log({fileUploadState})
  return (

    <Layout>
      <header className="relative flex flex-col items-center justify-center overflow-hidden px-5 pt-12">
        <div className="relative z-10 flex w-full max-w-screen-lg flex-col-reverse items-center  lg:flex-row">
          <div className="relative z-10 max-w-2xl pb-10 lg:py-12 lg:pb-12">
            <h1 className="w-full max-w-[14ch] font-heading text-4xl font-normal leading-[1.25] sm:mt-0 sm:text-5xl sm:leading-[1.15] lg:text-5xl lg:leading-[1.15] xl:text-6xl xl:leading-[1.15]">
              Admin Scratch Page
            </h1>
          </div>
        </div>
      </header>
      <div className="min-h-full flex items-center">
        <label className="flex justify-center h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
            <span className="flex items-center space-x-2">

              <span className="font-medium text-gray-600">
                Drop video files, or{' '}
                <span className="text-blue-600 underline">browse</span>
              </span>
            </span>
          <VideoUploader dispatch={dispatch} />
        </label>
      </div>
    </Layout>
  )
}

const VideoUploadAlert = () => {
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Read this before uploading any videos
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <ul role="list" className="list-disc pl-5 space-y-1">
              <li>
                Drag-and-drop doesn't work (yet). Click 'Browse' and select your
                files that way.
              </li>
              <li>
                The underlying upload library can only handle up to 5 videos at
                a time. Start by selecting your first 5. Edit the lesson details
                while they upload. Once all 5 have reached 100%, you can click
                'Browse' again and select the next 5. Etc.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
