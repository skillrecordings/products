import usePartySocket from 'partysocket/react'

export function useSocket(options: {
  onOpen?: (event: WebSocketEventMap['open']) => void
  onMessage?: (event: WebSocketEventMap['message']) => void
  onClose?: (event: WebSocketEventMap['close']) => void
  onError?: (event: WebSocketEventMap['error']) => void
  room?: string | null
}) {
  return usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTY_KIT_URL,
    ...options,
    room: options.room ?? process.env.NEXT_PUBLIC_PARTYKIT_ROOM_NAME,
  })
}
