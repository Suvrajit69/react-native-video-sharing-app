import { Video, ResizeMode } from "expo-av";
import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";

const VideoPlayer = ({ styles, uri, videoFinished }) => {
  const [isBuffering, setIsBuffering] = useState(true);
  return (
    <View className={`${styles} justify-center items-center`}>
      <Video
        source={{ uri: uri }}
        className={styles}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        shouldPlay
        onPlaybackStatusUpdate={(status) => {
          setIsBuffering(status.isBuffering);
          if (status.didJustFinish) {
            videoFinished();
          }
        }}
      />

      <ActivityIndicator
        className=" absolute"
        size="large"
        animating={isBuffering}
      />
    </View>
  );
};

export default VideoPlayer;
