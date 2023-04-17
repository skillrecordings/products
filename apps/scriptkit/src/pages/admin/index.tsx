import Layout from 'layouts'
import * as React from 'react'
import VideoUploader from 'module-builder/video-uploader'
export default function Adminpage() {
  return (
    <Layout>
      <header className="relative flex flex-col items-center justify-center overflow-hidden px-5 pt-12">
        <div className="relative z-10 flex w-full max-w-screen-lg flex-col-reverse items-center  lg:flex-row">
          <div className="relative z-10 max-w-2xl pb-10 lg:py-12 lg:pb-12">
            <h1 className="w-full max-w-[14ch] font-heading text-4xl font-normal leading-[1.25] sm:mt-0 sm:text-5xl sm:leading-[1.15] lg:text-5xl lg:leading-[1.15] xl:text-6xl xl:leading-[1.15]">
              Admin Scratch Pages
            </h1>
          </div>
        </div>
      </header>
      <div className="flex min-h-full items-center">
        <VideoUploader />
      </div>
    </Layout>
  )
}
