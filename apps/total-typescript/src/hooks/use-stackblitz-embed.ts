import React from 'react'
import sdk from '@stackblitz/sdk'

export const useStackblitzEmbed = async (
  projectId: string,
  openFile: string,
  elementOrId: string,
) => {
  React.useEffect(() => {
    sdk.embedProjectId(elementOrId, projectId, {
      forceEmbedLayout: true,
      openFile,
      showSidebar: false,
      view: 'editor',
      terminalHeight: 40,
      theme: 'dark',
      hideExplorer: true,
      hideNavigation: true,
      clickToLoad: false, // TODO: This might need to be TRUE since the embed is stealing focus on page load
      width: '100%',
    })
  }, [openFile])
}
