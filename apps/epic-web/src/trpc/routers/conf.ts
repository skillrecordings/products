import {publicProcedure, router} from '@skillrecordings/skill-lesson'

export const confRouter = router({
  livestream: publicProcedure.query(async () => {
    const CONF_24_LIVESTREAM_START_DATE = new Date('2024-04-10')
    const CONF_24_LIVESTREAM_END_DATE = new Date('2024-04-12')
    const currentDate = new Date()

    const showLivestream =
      currentDate >= CONF_24_LIVESTREAM_START_DATE &&
      currentDate <= CONF_24_LIVESTREAM_END_DATE

    return {
      showLivestream,
      livestreamUrl: 'https://www.youtube.com/watch?v=8117-JmjgOA',
    }
  }),
})
