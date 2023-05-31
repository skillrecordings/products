import {createScriptTag} from '../../utils'

const twttrEmbedScript = `
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs")
`

const twttrLoad = () => {
  if (
    typeof (window as any).twttr !== `undefined` &&
    (window as any).twttr.widgets &&
    typeof (window as any).twttr.widgets.load === `function`
  ) {
    ;(window as any).twttr.widgets.load(
      document.getElementsByClassName(`mdx-embed`),
    )
  }
}

export const handleTwttrLoad = () => {
  if (!(window as any).twttr) {
    createScriptTag(null, twttrEmbedScript)
    return {
      status: 'createScriptTag',
    }
  } else {
    twttrLoad()
    return {
      status: 'twttrLoad',
    }
  }
}
