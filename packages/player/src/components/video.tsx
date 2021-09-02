import * as React from 'react'
import {SyntheticEvent} from 'react'

type VideoProps = {
  loop?: boolean
  poster?: string
  preload?: string
  src?: string
  autoPlay?: boolean
  playsInline?: boolean
  muted?: boolean
  crossOrigin?: string
  id?: string
}

export const Video: React.FC<VideoProps> = React.forwardRef<
  HTMLVideoElement,
  VideoProps
>(
  (
    {
      children,
      loop,
      poster,
      preload,
      src,
      autoPlay,
      playsInline,
      muted,
      crossOrigin,
      id,
    },
    ref,
  ) => {
    function handleLoadStart(event: SyntheticEvent) {
      console.log(event)
    }

    function handleWaiting(event: SyntheticEvent) {
      console.log(event)
    }

    function handleCanPlay(event: SyntheticEvent) {
      console.log(event)
    }

    function handleCanPlayThrough(event: SyntheticEvent) {
      console.log(event)
    }

    function handlePlaying(event: SyntheticEvent) {
      console.log(event)
    }

    function handleEnded(event: SyntheticEvent) {
      console.log(event)
    }

    function handleSeeking(event: SyntheticEvent) {
      console.log(event)
    }

    function handleSeeked(event: SyntheticEvent) {
      console.log(event)
    }

    function handlePlay(event: SyntheticEvent) {
      console.log(event)
    }

    function handlePause(event: SyntheticEvent) {
      console.log(event)
    }

    function handleProgress(event: SyntheticEvent) {
      console.log(event)
    }

    function handleDurationChange(event: SyntheticEvent) {
      console.log(event)
    }

    function handleError(event: SyntheticEvent) {
      console.log(event)
    }

    function handleSuspend(event: SyntheticEvent) {
      console.log(event)
    }

    function handleAbort(event: SyntheticEvent) {
      console.log(event)
    }

    function handleEmptied(event: SyntheticEvent) {
      console.log(event)
    }

    function handleStalled(event: SyntheticEvent) {
      console.log(event)
    }

    function handleLoadedMetaData(event: SyntheticEvent) {
      console.log(event)
    }

    function handleLoadedData(event: SyntheticEvent) {
      console.log(event)
    }

    function handleTimeUpdate(event: SyntheticEvent) {
      console.log(event)
    }

    function handleRateChange(event: SyntheticEvent) {
      console.log(event)
    }

    function handleVolumeChange(event: SyntheticEvent) {
      console.log(event)
    }

    return (
      <video
        id={id}
        crossOrigin={crossOrigin}
        ref={ref}
        muted={muted}
        preload={preload}
        loop={loop}
        playsInline={playsInline}
        autoPlay={autoPlay}
        poster={poster}
        src={src}
        onLoadStart={handleLoadStart}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onCanPlayThrough={handleCanPlayThrough}
        onPlaying={handlePlaying}
        onEnded={handleEnded}
        onSeeking={handleSeeking}
        onSeeked={handleSeeked}
        onPlay={handlePlay}
        onPause={handlePause}
        onProgress={handleProgress}
        onDurationChange={handleDurationChange}
        onError={handleError}
        onSuspend={handleSuspend}
        onAbort={handleAbort}
        onEmptied={handleEmptied}
        onStalled={handleStalled}
        onLoadedMetadata={handleLoadedMetaData}
        onLoadedData={handleLoadedData}
        onTimeUpdate={handleTimeUpdate}
        onRateChange={handleRateChange}
        onVolumeChange={handleVolumeChange}
        tabIndex={-1}
      >
        {children}
      </video>
    )
  },
)
