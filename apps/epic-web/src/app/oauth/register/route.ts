import {customAlphabet} from 'nanoid'
import {NextResponse} from 'next/server'

const nanoid = customAlphabet('ABCDEFGHIJKLMNOP', 6)
export async function POST() {
  return NextResponse.json(
    {
      client_id: nanoid(),
      client_secret: nanoid(),
    },
    {status: 201},
  )
}
