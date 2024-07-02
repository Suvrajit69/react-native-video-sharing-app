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
import DpChangeModal from "../../components/DpChangeModal";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  if (!user) return <Redirect href="/sign-in" />;

  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));
  const [modalOpen, setModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar);

  const logOut = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
  };

  const handleModal = (newDpUrl) => {
    if (newDpUrl) {
      setAvatar(newDpUrl);
    }
    setModalOpen(false);
  };
  console.log(posts);
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
                source={{ uri: avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </TouchableOpacity>

            <DpChangeModal
              dp={avatar}
              isOpen={modalOpen}
              withKeyBoard={false}
              animation="fade"
              modalClose={handleModal}
            />

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
