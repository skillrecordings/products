import {loadScript} from './load-script'

declare global {
  interface Window {
    define: any
  }
}

const Prettier = () => {
  let hasLoaded = false

  const loadPrettier = async () => {
    if (hasLoaded) return

    /**
     * Helps Monaco editor get over a too-sensitive error
     *
     * https://stackoverflow.com/questions/55057425/can-only-have-one-anonymous-define-call-per-script-file
     */
    const define = window.define
    window.define = () => {}

    await Promise.all([
      loadScript('https://unpkg.com/prettier@2.3.2/standalone.js'),
      loadScript('https://unpkg.com/prettier@2.3.2/parser-typescript.js'),
    ])

    window.define = define

    hasLoaded = true
  }

  const format = async (code: string) => {
    try {
      await loadPrettier()
      return (window as any).prettier.format(code, {
        parser: 'typescript',
        plugins: (window as any).prettierPlugins,
      })
    } catch (e) {
      console.error(e)
    }
    /**
     * If loading prettier fails, just
     * load the code
     */
    return code
  }

  return {
    load: loadPrettier,
    format,
  }
}

export const prettierLoader = Prettier()
