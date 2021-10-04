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
    <div className="relative w-full h-full border border-gray-800 border-l-0 cueplayer-react-side-panel">
      <Tabs className="lg:absolute inset-0 flex flex-col">
        <TabList className="relative z-[1] flex-shrink-0 border-b border-gray-800">
          {resourceList && (
            <Tab className="px-3 py-2 font-semibold">Lessons</Tab>
          )}
          {videoCuesList && (
            <Tab className="px-3 py-2 font-semibold">Notes</Tab>
          )}
        </TabList>
        <TabPanels className="flex-grow relative">
          {resourceList && (
            <TabPanel className="lg:absolute inset-0 overflow-y-auto">
              {resourceList}
            </TabPanel>
          )}
          {videoCuesList && (
            <TabPanel className="lg:absolute inset-0 overflow-y-auto">
              {videoCuesList}
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </div>
  )
}
