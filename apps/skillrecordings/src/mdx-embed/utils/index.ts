export const createScriptTag = (
  providerEmbedUrl: string | null,
  providerEmbedScript: string | null,
) => {
  const script = document.createElement(`script`)

  script.type = `text/javascript`

  if (providerEmbedUrl) {
    script.src = providerEmbedUrl
  }

  if (providerEmbedScript) {
    script.innerText = providerEmbedScript
  }

  script.onerror = (error) => {
    console.error(`MDXEmbedProvider ${(error as any).type}`, error)
  }

  document.getElementsByTagName(`head`)[0].appendChild(script)
}

export const isEmptyString = (value?: string) =>
  value === null || value === undefined || value.length === 0
