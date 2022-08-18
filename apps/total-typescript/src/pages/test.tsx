import sdk from '@stackblitz/sdk'
import React from 'react'
import MuxPlayer from '@mux/mux-player-react'

const TestPage = () => {
  React.useEffect(() => {
    sdk.embedProjectId('embed', 'node-1buntj', {
      forceEmbedLayout: true,
      openFile: 'src/01-number.problem.ts',
      //   openFile: ['src/01-number.problem.ts'],
      //   openFile: ['src/01-number.problem.ts', 'src/01-number.solution.ts'],
      //   openFile: 'src/01-number.solution.ts,src/01-number.problem.ts',
      showSidebar: false,
      view: 'editor',
      theme: 'dark',
      hideExplorer: true,
      hideNavigation: true,
      clickToLoad: false,
    })
  }, [])
  return (
    <div className="bg-black flex flex-col items-center pb-16">
      <div className="max-w-screen-xl w-full">
        <MuxPlayer
          streamType="on-demand"
          playbackId="EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs"
          metadata={{
            video_id: 'video-id-54321',
            video_title: 'Test video title',
            viewer_user_id: 'user-id-007',
          }}
        />

        <div className="flex items-center justify-between w-full py-2">
          <div className="flex items-center gap-5">
            <h2 className="pt-4 pb-2 text-2xl font-bold border-b-2 border-indigo-400 px-3">
              Exercise
            </h2>
            <h2 className="pt-4 pb-2 text-2xl font-semibold px-3">
              Transcript
            </h2>
          </div>
          <a
            href="/"
            className="text-white bg-teal-600 px-4 py-3 font-bold text-lg self-start"
          >
            View Solution →
          </a>
        </div>
        <div className="w-full h-[800px] flex items-center justify-center bg-black">
          <div id="embed" className="h-full w-full" />
        </div>
      </div>
      <div className="max-w-screen-xl pt-8 w-full"></div>
    </div>
  )
}
export default TestPage
