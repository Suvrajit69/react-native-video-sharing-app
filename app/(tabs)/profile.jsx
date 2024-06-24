import {
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import EmptyState from "../../components/EmptyState";
import { StatusBar } from "expo-status-bar";
import { getUserPosts, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import InfoBox from "../../components/InfoBox";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import Modal from "../../components/Modal";
import { Entypo } from "@expo/vector-icons";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  if (!user) return <Redirect href="/sign-in" />;

  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));
  const [modalOpen, setModalOpen] = useState(false);

  const logOut = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary flex-1">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-10 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logOut}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-16 h-16 border border-secondary border-dashed rounded-lg justify-center items-center"
              onPress={() => setModalOpen((prev) => !prev)}
            >
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </TouchableOpacity>
            <Modal isOpen={modalOpen} withKeyBoard={false} animation="fade">
              <View className="w-[80%] h-[45%] bg-primary justify-center items-center rounded-md relative">
                <View className="w-32 h-32 border border-secondary border-dashed rounded-lg justify-center items-center">
                  <Image
                    source={{ uri: user?.avatar }}
                    className="w-[90%] h-[90%] rounded-lg"
                    resizeMode="cover"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setModalOpen((prev) => !prev)}
                  className="absolute top-3 right-3"
                >
                  <Entypo name="cross" size={30} color="white" />
                </TouchableOpacity>
              </View>
            </Modal>
            <InfoBox
              title={user?.userName}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />
            <View className="flex-row ">
              <InfoBox
                title={posts.length || 0}
                subTitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-lg"
              />
              <InfoBox
                title="1.2k"
                subTitle="Followers"
                containerStyles=""
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subTitle="No videos you created"
          />
        )}
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Profile;
