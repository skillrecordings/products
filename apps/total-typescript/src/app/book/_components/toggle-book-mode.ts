'use server'

import {cookies} from 'next/headers'

export async function toggleMode() {
  const cookieStore = cookies()

  const bookPrefsCookie = cookieStore.get('bookPrefs')
  const prefs = bookPrefsCookie ? JSON.parse(bookPrefsCookie.value) : {}
  const mode: 'video' | 'book' = prefs.mode || 'book'
  cookieStore.set(
    'bookPrefs',
    JSON.stringify({...prefs, mode: mode === 'book' ? 'video' : 'book'}),
    {},
  )
}
