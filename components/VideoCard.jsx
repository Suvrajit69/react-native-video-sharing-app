import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { icons } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";
import VideoPlayer from "./VideoPlayer";
import { AntDesign } from "@expo/vector-icons";
import { likeVideo } from "../lib/appwrite";

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    $id: videoId,
    like = [], // Default value set to an empty array
    users: { userName, avatar, $id: userId },
  },
}) => {
  const { user } = useGlobalContext();
  const [play, setPlay] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(like.length);

  // Initialize the liked state
  useEffect(() => {
    const isLiked = like.some((likeObj) => likeObj.$id === user.$id);
    setLiked(isLiked);
  }, [like, user.$id]);

  const onLike = async () => {
    try {
      const updatedVideo = await likeVideo(user.$id, videoId);
      const isLiked = updatedVideo.like.some(
        (likeObj) => likeObj.$id === user.$id
      );
      setLiked(isLiked);
      setLikeCount(updatedVideo.like.length);
    } catch (error) {
      console.log(error);
    }
  };

  const videoFinished = () => {
    setPlay(false);
  };

  return (
    <View className="flex-col items-center px-4 mb-2 bg-gray-900 rounded-xl pt-3 scale-95">
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
        {user?.$id === userId ? (
          <View className="pt-2">
            <Image
              source={icons.menu}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </View>
        ) : null}
      </View>
      {play ? (
        <VideoPlayer
          styles="w-full h-60 relative rounded-lg mt-3 "
          uri={video}
          videoFinished={videoFinished}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 mt-3 relative justify-center items-center"
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
      <View className="self-start py-5 flex-row gap-5 items-center">
        <TouchableOpacity onPress={onLike} key={user.$id}>
          {liked ? (
            <AntDesign name="heart" size={30} color="red" />
          ) : (
            <AntDesign name="hearto" size={30} color="white" />
          )}
        </TouchableOpacity>
        <Text className="text-white text-xl">
          {likeCount}{" "}
          <Text className="text-sm font-pregular">
            {likeCount > 1 ? "likes" : "like"}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default VideoCard;
