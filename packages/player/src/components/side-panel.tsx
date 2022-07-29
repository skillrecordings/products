import * as React from 'react'
import cx from 'classnames'
import {useVideo} from '../context/video-context'
import {selectIsFullscreen} from '../selectors'
import {useSelector} from '@xstate/react'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@reach/tabs'

type SidePanelProps = {
  videoResourcesList?: React.ReactNode
  videoCuesList?: React.ReactNode
}

export const SidePanel: React.FC<React.PropsWithChildren<SidePanelProps>> = ({
  videoResourcesList,
  videoCuesList,
}) => {
  const videoService = useVideo()
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  return (
    <div
      className={cx('cueplayer-react-side-panel', {
        'with-fullscreen': isFullscreen,
      })}
    >
      <Tabs>
        <TabList>
          {videoResourcesList && <Tab>Lessons</Tab>}
          {videoCuesList && <Tab>Notes</Tab>}
        </TabList>
        <TabPanels>
          {videoResourcesList && <TabPanel>{videoResourcesList}</TabPanel>}
          {videoCuesList && <TabPanel>{videoCuesList}</TabPanel>}
        </TabPanels>
      </Tabs>
    </div>
  )
}
