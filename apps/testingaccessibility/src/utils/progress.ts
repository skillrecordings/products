import {createClient} from '@supabase/supabase-js'
import axios from 'axios'

const SUPABASE_URL = `https://${process.env.PROGRESS_DATABASE_ID}.supabase.co`
const SUPABASE_KEY = process.env.SUPABASE_KEY
export const supabase = SUPABASE_KEY && createClient(SUPABASE_URL, SUPABASE_KEY)
export const progressTable = process.env.PROGRESS_TABLE_NAME || 'users_dev'

type ProgressProps = {
  slug: string
}

export const setProgressForUser = async ({slug}: ProgressProps) =>
  await axios
    .post(`/api/progress/lessons/${slug}`)
    .catch(() => {
      throw new Error('failed to set progress')
    })
    .then(({data}) => {
      console.debug('progress set! ✔️')
      return data
    })

export const getProgressForUser = async () =>
  await axios
    .get(`/api/progress`)
    .catch(() => {
      throw new Error('failed to get progress')
    })
    .then(({data}) => {
      console.debug('progress loaded! ✔️', data)
      return data
    })
