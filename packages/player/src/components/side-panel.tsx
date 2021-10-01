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
    <div className="relative w-full h-full">
      <Tabs className="lg:absolute inset-0 flex flex-col">
        <TabList className="relative z-[1] flex-shrink-0">
          {resourceList && <Tab>Lessons</Tab>}
          {videoCuesList && <Tab>Notes</Tab>}
        </TabList>
        <TabPanels className="flex-grow relative border-b border-r border-gray-800">
          {resourceList && (
            <TabPanel className="lg:absolute inset-0">{resourceList}</TabPanel>
          )}
          {videoCuesList && (
            <TabPanel className="lg:absolute inset-0">{videoCuesList}</TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </div>
  )
}
