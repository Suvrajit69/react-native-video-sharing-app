import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { Video, ResizeMode } from "expo-av";
import * as ImagePicker from "expo-image-picker";

import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { icons } from "../../constants";
import { router } from "expo-router";
import { createVideo } from "../../lib/appwrite";
import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import Camera from "../../components/Camera";
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  if (!user.$id) {
    router.push("/sign-in");
    setTimeout(() => {
      Alert.alert("user not found. Please log in!");
    }, 2000);
  }

  console.log("user: ", user.$id);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const [cameraOn, setCameraOn] = useState(false);

  const [cameraStatus, requestCameraPermission] = useCameraPermissions();
  const [audioStatus, requestAudioPermission] = useMicrophonePermissions();

  const openPicker = async (selectType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 1000);
    }
  };

  const openCamera = () => {
    if (cameraStatus.status === "denied" || !cameraStatus.granted) {
      requestCameraPermission();
    } else if (audioStatus.status === "denied" || !audioStatus.granted) {
      requestAudioPermission();
    } else {
      setCameraOn(true);
    }
  };

  const capturePhoto = async () => {
    const photo = await ImagePicker.launchCameraAsync();
    if (!photo.canceled) {
      setForm({ ...form, thumbnail: photo.assets[0] });
    }
  };

  const closeCamera = (video) => {
    if (video.uri) {
      setForm({ ...form, video: video });
    }
    setCameraOn(false);
  };

  const submit = async () => {
    if (!form.prompt || !form.title || !form.thumbnail || !form.video) {
      return Alert.alert("Please fill in all the fields");
    }
    setUploading(true);

    try {
      await createVideo(form, user.$id);
      Alert.alert("Success", "Post uploaded sucessfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log(error);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setUploading(false);
    }
  };
  return cameraOn ? (
    <Camera closeCamera={closeCamera} />
  ) : (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <View>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            ) : (
              <View className="w-full h-40 bg-black-100 rounded-2xl ">
                <View className="h-full w-full flex flex-row justify-center items-center gap-x-5">
                  <TouchableOpacity
                    className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center"
                    onPress={() => openPicker("video")}
                  >
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-1/2 h-1/2"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center"
                    onPress={() => openCamera("video")}
                  >
                    <Image
                      source={icons.camera}
                      resizeMode="contain"
                      className="w-1/2 h-1/2"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <View>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-16  bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex flex-row space-x-16">
                <TouchableOpacity onPress={() => openPicker("image")}>
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-10 h-10"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={capturePhoto}>
                  <Image
                    source={icons.camera}
                    resizeMode="contain"
                    className="w-10 h-10"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The prompt tou used to create this video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />
        <CustomButton
          title="Publish"
          handlepress={submit}
          containerStyles="mt-10"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
