import * as React from 'react'
import cookies from '../utils/cookies'

const PLAY_PREFS_KEY = 'cueplayer-react-prefs'

export const defaultSubtitlePreference = {
  id: null,
  kind: null,
  label: 'off',
  language: null,
}

export type PlayerPrefs = {
  volumeRate: number
  playbackRate: number
  autoplay: boolean
  videoQuality: {
    bitrate: any
    height: any
    id: string
    width: any
  }
  subtitle: {
    id: any
    kind: any
    label: any
    language: any
  }
  muted: boolean
  theater: boolean
  defaultView: string
  activeSidebarTab: number
}

const defaultPlayerPreferences: PlayerPrefs = {
  volumeRate: 80,
  playbackRate: 1,
  autoplay: false,
  videoQuality: {
    bitrate: null,
    height: null,
    id: 'auto',
    width: null,
  },
  subtitle: defaultSubtitlePreference,
  muted: false,
  theater: false,
  defaultView: 'transcript',
  activeSidebarTab: 0,
}

export const getPlayerPrefs = () => {
  if (typeof window === 'undefined') {
    return defaultPlayerPreferences
  }
  return (
    cookies.get(PLAY_PREFS_KEY) ||
    cookies.set(PLAY_PREFS_KEY, defaultPlayerPreferences)
  )
}

export const savePlayerPrefs = (options: any) => {
  return cookies.set(PLAY_PREFS_KEY, {
    ...defaultPlayerPreferences,
    ...getPlayerPrefs(),
    ...options,
  })
}

export const usePlayerPrefs = () => {
  const [playerPrefs, setPlayerPrefs] = React.useState<PlayerPrefs>(
    getPlayerPrefs(),
  )

  const setPlayerPrefsOptions = React.useCallback((options: any) => {
    console.debug('setting player prefs', {options})
    const newPrefs = savePlayerPrefs(options)
    setPlayerPrefs(newPrefs)
  }, [])

  return {
    setPlayerPrefs: setPlayerPrefsOptions,
    getPlayerPrefs: React.useCallback(getPlayerPrefs, []),
    ...playerPrefs,
  }
}
