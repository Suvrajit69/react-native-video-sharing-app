import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { StatusBar } from "expo-status-bar";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

const Home = () => {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);

  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  // console.log("posts",posts)
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary flex-1">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6 mt-12">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  {user ? "Welcome back" : "Sign in to Aora"}
                </Text>
                {user ? (
                  <Text className="text-2xl font-psemibold text-white">
                    {user?.userName}
                  </Text>
                ) : (
                  <FontAwesome
                    name="sign-in"
                    size={35}
                    color="green"
                    onPress={()=>router.push("/sign-in")}
                  />
                )}
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  resizeMode="contain"
                  className="w-9 h-10"
                />
              </View>
            </View>
            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular ">
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Posts Found"
            subTitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Home;
