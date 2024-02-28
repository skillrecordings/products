type VideoLayoutProps = {
  params: {module: string; resource?: string}
}

const VideoLayout: React.FC<React.PropsWithChildren<VideoLayoutProps>> = ({
  children,
  params,
}) => {
  return children
}

export default VideoLayout
