import {publicProcedure, router} from '@skillrecordings/skill-lesson'

export const confRouter = router({
  livestream: publicProcedure.query(async () => {
    const CONF_25_LIVESTREAM_START_DATE = new Date('2025-03-25')
    const CONF_25_LIVESTREAM_END_DATE = new Date('2025-03-27')
    const currentDate = new Date()

    const showLivestream =
      currentDate >= CONF_25_LIVESTREAM_START_DATE &&
      currentDate <= CONF_25_LIVESTREAM_END_DATE

    return {
      showLivestream,
      livestreamUrl:
        'https://www.youtube.com/live/SDuvi5eUqp0?si=dzNuvYGzmwzUq0iC',
    }
  }),
})
