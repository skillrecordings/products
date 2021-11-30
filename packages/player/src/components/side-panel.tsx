import * as React from 'react'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@reach/tabs'

type SidePanelProps = {
  resourceList?: React.ReactNode
  videoCuesList?: React.ReactNode
}

export const SidePanel: React.FC<SidePanelProps> = ({
  resourceList,
  videoCuesList,
}) => {
  return (
    <div className="cueplayer-react-side-panel">
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
