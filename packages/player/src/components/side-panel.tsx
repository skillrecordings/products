import * as React from 'react'
import cx from 'classnames'
import {useVideo} from '../context/video-context'
import {selectIsFullscreen} from '../selectors'
import {useSelector} from '@xstate/react'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@reach/tabs'

type SidePanelProps = {
  resourceList?: React.ReactNode
  videoCuesList?: React.ReactNode
}

export const SidePanel: React.FC<SidePanelProps> = ({
  resourceList,
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
          {resourceList && <Tab>Lessons</Tab>}
          {videoCuesList && <Tab>Notes</Tab>}
        </TabList>
        <TabPanels>
          {resourceList && <TabPanel>{resourceList}</TabPanel>}
          {videoCuesList && <TabPanel>{videoCuesList}</TabPanel>}
        </TabPanels>
      </Tabs>
    </div>
  )
}
