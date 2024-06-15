import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";
import VideoPlayer from "./VideoPlayer";

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    users: { userName, avatar, $id },
  },
}) => {
  const { user } = useGlobalContext();
  console.log("users", video);
  const [play, setPlay] = useState(false);

  const videoFinished =()=>{
    setPlay(false)
  }

  return (
    <View className="flex-col items-center px-4 mb-14 bg-gray-900 rounded-xl pt-3 scale-95">
      <View className="flex-row items-start bg-gray-900">
        <View className="justify-center items-center flex-row flex-1 ">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              resizeMode="cover"
              className="w-full h-full rounded-lg"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-sm text-white font-psemibold"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {userName}
            </Text>
          </View>
        </View>
        {user.$id === $id ? (
          <View className="pt-2">
            <Image
              source={icons.menu}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </View>
        ) : (
          <></>
        )}
      </View>
      {play ? (
        <VideoPlayer
          styles="w-full h-60  mt-3 relative justify-center items-center rounded-lg"
          uri={video}
          videoFinished={videoFinished}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60  mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full mt-3 rounded-lg"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      <Text className="mt-4">fdfdfdf</Text>
    </View>
  );
};

export default VideoCard;
