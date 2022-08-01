import useClipboard from 'react-use-clipboard'

export const useCopyToClipboard = (text: string, successDuration?: number) => {
  const [isCopied, copyToClipboard] = useClipboard(text, {
    successDuration: successDuration || 700,
  })
  return {copyToClipboard, isCopied}
}
