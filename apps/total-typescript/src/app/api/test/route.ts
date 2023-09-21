import {Client} from '@planetscale/database'

export const runtime = 'edge'

const db = new Client({
  url: process.env['DATABASE_URL'],
})

export async function GET(request: Request) {
  const conn = db.connection()

  const result = await conn.execute('SELECT * FROM users WHERE email=?', [
    'joel@egghead.io',
  ])

  console.log(result)

  return new Response(`I am an Edge Function!`, {
    status: 200,
  })
}
