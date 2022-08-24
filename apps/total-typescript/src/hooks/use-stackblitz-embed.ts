import React from 'react'
import sdk from '@stackblitz/sdk'

export const useStackblitzEmbed = (
  projectId: string,
  openFile: string,
  elementOrId: string | HTMLElement,
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
      clickToLoad: false,
      width: '100%',
    })
  }, [openFile])
}
