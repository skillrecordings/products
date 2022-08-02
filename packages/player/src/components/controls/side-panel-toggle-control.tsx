import * as React from 'react'
import cx from 'classnames'
import {useVideo} from '../../context/video-context'
import {useSelector} from '@xstate/react'
import {selectWithSidePanel} from '../../selectors'
import {savePlayerPrefs} from '../../hooks/use-player-prefs'

type SidePanelToggleProps = {
  className?: string
}

export const SidePanelToggleControl: React.FC<
  React.PropsWithChildren<SidePanelToggleProps>
> = ({className}) => {
  const videoService = useVideo()
  const withSidePanel = useSelector(videoService, selectWithSidePanel)

  function handleClick() {
    videoService.send({type: 'TOGGLE_SIDE_PANEL'})
    savePlayerPrefs({theater: !withSidePanel})
  }
  return (
    <button
      className={cx(
        className,
        {
          'cueplayer-react-icon-format-indent-decrease': !withSidePanel,
          'cueplayer-react-icon-format-indent-increase': withSidePanel,
        },
        'cueplayer-react-side-panel-control cueplayer-react-control cueplayer-react-button cueplayer-react-icon',
      )}
      type="button"
      tabIndex={0}
      onClick={handleClick}
    >
      <span className="cueplayer-react-control-text">Toggle side panel</span>
    </button>
  )
}
