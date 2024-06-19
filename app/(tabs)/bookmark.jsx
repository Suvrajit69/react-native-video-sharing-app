import { View, Text, SafeAreaView, FlatList, Image, ActivityIndicator } from "react-native";
import React, { useState, useCallback } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getAllLikedVideos } from "../../lib/appwrite";
import VideoCard from "../../components/VideoCard";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { useFocusEffect } from "expo-router";
import { images } from "../../constants";

const BookMark = () => {
  const { user } = useGlobalContext();
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedVideos = async () => {
    try {
      const posts = await getAllLikedVideos(user.$id);
      setLikedPosts(posts);
    } catch (error) {
      console.error("Error fetching liked videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLikedVideos();

      return;
    }, [])
  );

  return (
    <SafeAreaView className="bg-primary flex-1">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={50}/>
        </View>
      ) : (
        <FlatList
          data={likedPosts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="my-6 px-4  mt-12">
              <View className="justify-between px-2 items-center flex-row mb-6">
                <Text className="font-pmedium text-base text-white">
                  Videos you liked
                </Text>

                <View className="mt-1.5">
                  <Image
                    source={images.logoSmall}
                    resizeMode="contain"
                    className="w-9 h-10"
                  />
                </View>
              </View>
              <SearchInput />
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Liked Videos"
              subTitle="Please like some videos"
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default BookMark;
