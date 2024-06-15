import { Video, ResizeMode } from 'expo-av'
import React from 'react'

const VideoPlayer = ({styles, uri, videoFinished}) => {
  // console.log(uri)
  return (
    <Video
        source={{ uri: uri }}
        className= {styles}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        shouldPlay
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            videoFinished()
          }
        }}
      />
  )
}

export default VideoPlayer