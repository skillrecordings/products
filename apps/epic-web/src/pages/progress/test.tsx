import React from 'react'

const ParentComponent = () => {
  const iframeRef = React.useRef<any>(null)

  const handleIframeLoad = () => {
    // Once the iframe is loaded, we can start communicating with it.
    iframeRef.current.contentWindow.postMessage(
      {type: 'kcdshop:parent:ready'},
      '*',
    )
  }

  const handleReceiveMessage = (event: any) => {
    // Handle messages received from the child iframe.
    if (event.data.type === 'kcdshop:progress:ready') {
      // The child iframe is ready.
      console.log('PARENT RECEIVED: kcdshop:progress:ready')
      // Request progress data from the child iframe
      iframeRef.current.contentWindow.postMessage(
        {type: 'kcdshop:parent:get-progress'},
        '*',
      )
    } else if (event.data.type === 'kcdshop:progress:resolved') {
      // Handle progress data received from the child iframe.
      console.log(
        'PARENT RECEIVED: kcdshop:progress:resolved',
        event.data.progress,
      )
    } else if (event.data.type === 'kcdshop:progress:rejected') {
      // Handle error data received from the child iframe.
      console.error(
        'PARENT RECEIVED: kcdshop:progress:rejected',
        event.data.error,
      )
    }
  }

  React.useEffect(() => {
    // Attach an event listener to handle messages from the child iframe.
    window.addEventListener('message', handleReceiveMessage)
    return () => {
      window.removeEventListener('message', handleReceiveMessage)
    }
  }, [])

  return (
    <>
      <iframe
        ref={iframeRef}
        src={`${process.env.NEXT_PUBLIC_URL}/progress`}
        onLoad={handleIframeLoad}
      />
    </>
  )
}

export default ParentComponent
