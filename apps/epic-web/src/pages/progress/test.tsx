import React, {useEffect} from 'react'

const ParentComponent = () => {
  const [progressData, setProgressData] = React.useState()
  useEffect(() => {
    // Add an event listener to listen for messages from the iframe
    const handleIframeMessage = (event: any) => {
      if (event.data.type === 'kcdshop:progress:resolved') {
        console.log('Received progress data:', event.data.progress)
        setProgressData(event.data.progress)
      }
    }

    // Send a message to the iframe
    const iframe: any = document.querySelector('iframe')
    iframe?.contentWindow.postMessage(
      {type: 'kcdshop:parent:get-progress'},
      '*',
    )

    // Add the event listener
    window.addEventListener('message', handleIframeMessage)

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('message', handleIframeMessage)
    }
  }, [])

  return (
    <div>
      {progressData && JSON.stringify(progressData)}
      <iframe src="http://localhost:3021/progress" width="100%" height="100%" />
    </div>
  )
}

export default ParentComponent
