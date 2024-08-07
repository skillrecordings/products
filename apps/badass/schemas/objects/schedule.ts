import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'schedule',
  type: 'object',
  title: 'Publish schedule',
  fields: [
    defineField({
      name: 'publish',
      type: 'datetime',
      title: 'Date of publication',
      description: 'When should this episode be available?',
      options: {
        // inputUtc: false,
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        // inputDate: true,
        // inputTime: true,
        timeStep: 15,
        // calendarTodayLabel: 'Today',
        // placeholderDate: '2017-04-18',
        // placeholderTime: '11:29',
      },
    }),
    defineField({
      name: 'unpublish',
      type: 'datetime',
      title: 'When should this episode be unaccessible?',
      description: 'In case you want to unpublish an episode on a said date.',
      options: {
        // inputUtc: false,
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        // inputDate: true,
        // inputTime: true,
        timeStep: 15,
        // calendarTodayLabel: 'Today',
        // placeholderDate: '2017-04-18',
        // placeholderTime: '11:29',
      },
    }),
  ],
})
