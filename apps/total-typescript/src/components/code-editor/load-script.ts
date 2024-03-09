export const loadScript = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    const scriptElement = document.createElement('script')
    scriptElement.src = src

    const timeout = setTimeout(() => {
      reject('Timeout')
    }, 15000)

    scriptElement.onload = () => {
      resolve()
      clearTimeout(timeout)
    }
    document.body.appendChild(scriptElement)
  })
}
