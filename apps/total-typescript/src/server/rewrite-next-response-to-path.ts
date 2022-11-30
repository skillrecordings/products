import {NextRequest, NextResponse} from 'next/server'

export function rewriteToPath(path: string, req: NextRequest) {
  return NextResponse.rewrite(new URL(path, req.url))
}
