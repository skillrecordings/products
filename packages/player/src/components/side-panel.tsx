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
      <Tabs className="inset-0 flex flex-col lg:absolute">
        <TabList className="relative z-[1] flex-shrink-0 border-b border-gray-800">
          {resourceList && (
            <Tab className="px-3 py-2 font-semibold">Lessons</Tab>
          )}
          {videoCuesList && (
            <Tab className="px-3 py-2 font-semibold">Notes</Tab>
          )}
        </TabList>
        <TabPanels className="relative flex-grow">
          {resourceList && (
            <TabPanel className="inset-0 overflow-y-auto lg:absolute">
              {resourceList}
            </TabPanel>
          )}
          {videoCuesList && (
            <TabPanel className="inset-0 overflow-y-auto lg:absolute">
              {videoCuesList}
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </div>
  )
}
