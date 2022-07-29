import {useSelector} from '@xstate/react'
import * as React from 'react'
import {useVideo} from '../context/video-context'
import {
  selectCurrentTime,
  selectIsSubmittingCueNote,
  selectCueNoteVisibility,
  selectViewer,
} from '../selectors'

export const CueForm: React.FC<React.PropsWithChildren<unknown>> = () => {
  const videoService = useVideo()
  const formRef = React.useRef<HTMLFormElement>(null)
  const currentTime = useSelector(videoService, selectCurrentTime)
  const isSubmittingCueNote = useSelector(
    videoService,
    selectIsSubmittingCueNote,
  )
  const cueNoteVisibility = useSelector(videoService, selectCueNoteVisibility)
  const viewer = useSelector(videoService, selectViewer)

  React.useEffect(() => {
    videoService.send({
      type: 'SET_CUE_FORM_ELEM',
      cueFormElemRef: formRef,
    })
  }, [formRef.current])

  return (
    <form
      className="cueplayer-react-cue-form"
      ref={formRef}
      onFocus={() => {
        videoService.send({type: 'TAKE_NOTE'})
      }}
      onBlur={() => {
        videoService.send({type: 'CANCELLED'})
      }}
      onSubmit={(e) => {
        e.preventDefault()
        const cue = {
          text: formRef?.current?.input.value,
          startTime: currentTime,
          endTime: currentTime,
        } as VTTCue

        if (formRef?.current?.input.value !== '') {
          videoService.send({
            type: 'SUBMITTED',
            cue: new VTTCue(cue.startTime, cue.endTime, cue.text),
          })
        }
      }}
    >
      <div className="cueplayer-react-cue-form-input-container">
        {isSubmittingCueNote ? (
          <LoadingIndicator />
        ) : (
          <img
            alt={viewer.name}
            src={viewer.avatar_url}
            className="cueplayer-react-cue-form-image"
            width={24}
            height={24}
          />
        )}
        <input
          disabled={isSubmittingCueNote}
          autoComplete="off"
          aria-label="Leave your note here (required)"
          placeholder="Leave your note here..."
          className="cueplayer-react-cue-form-input"
          id="input"
          type="text"
          onChange={() => {
            videoService.send({type: 'CHANGE'})
          }}
          required
        />
      </div>
      <div className="cueplayer-react-cue-form-input-actions">
        <div className="cueplayer-react-cue-form-visibility-select">
          <VisibilityIcon />
          <label>
            <span className="cueplayer-react-sr-only">Visibility</span>
            <select
              name="state"
              defaultValue={cueNoteVisibility}
              onChange={(e) => {
                const state = e.target.value
                // @ts-ignore
                videoService.send('TOGGLE_CUE_STATE', {visibility: state})
              }}
            >
              <option value="published">Everyone</option>
              <option value="draft">Only me</option>
            </select>
          </label>
        </div>

        <button
          className="cueplayer-react-cue-form-submit-button"
          disabled={isSubmittingCueNote}
          type="submit"
        >
          Send
        </button>
      </div>
    </form>
  )
}

const LoadingIndicator = () => {
  return (
    <div className="cueplayer-react-cue-form-loader">
      <svg
        height="16"
        width="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="#fff">
          <g className="nc-loop-dots-4-16-icon-f">
            <circle cx="3" cy="8" fill="#fff" r="2" />
            <circle cx="8" cy="8" r="2" />
            <circle cx="13" cy="8" fill="#fff" r="2" />
          </g>
          <style>{loaderAnimationCSS}</style>
        </g>
      </svg>
    </div>
  )
}

const loaderAnimationCSS = `.nc-loop-dots-4-16-icon-f{--animation-duration:0.8s}.nc-loop-dots-4-16-icon-f *{opacity:.4;transform:scale(.75);animation:nc-loop-dots-4-anim var(--animation-duration) infinite}.nc-loop-dots-4-16-icon-f :nth-child(1){transform-origin:3px 8px;animation-delay:-.3s;animation-delay:calc(var(--animation-duration)/-2.666)}.nc-loop-dots-4-16-icon-f :nth-child(2){transform-origin:8px 8px;animation-delay:-.15s;animation-delay:calc(var(--animation-duration)/-5.333)}.nc-loop-dots-4-16-icon-f :nth-child(3){transform-origin:13px 8px}@keyframes nc-loop-dots-4-anim{0%,100%{opacity:.4;transform:scale(.75)}50%{opacity:1;transform:scale(1)}}`

const VisibilityIcon = () => {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path
        fillRule="evenodd"
        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}
