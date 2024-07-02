import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { Entypo } from "@expo/vector-icons";
import Modal from "./Modal";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { changeNewDpImage } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const DpChangeModal = ({ dp, isOpen, withKeyBoard, animation, modalClose }) => {
  const [newDpImage, setNewDpImage] = useState(null);
  const { user } = useGlobalContext();

  const openPicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewDpImage(result.assets[0]);
    } else {
      setTimeout(() => {
        Alert.alert("No file selected", "Please select files to upload");
      }, 1000);
    }
  };

  const confirmNewDp = async () => {
    try {
      const res = await changeNewDpImage(newDpImage, user.$id, dp);
      Alert.alert("Success", "Your dp changed successfuly");
      modalClose(res.avatar);
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen} withKeyBoard={withKeyBoard} animation={animation}>
      <View className="w-[80%] h-[45%] bg-primary justify-center items-center rounded-md relative">
        <View className="w-32 h-32 border border-secondary border-dashed rounded-lg justify-center items-center">
          <Image
            source={{ uri: newDpImage?.uri || dp }}
            className="w-[90%] h-[90%] rounded-lg"
            resizeMode="cover"
          />
        </View>
        <TouchableOpacity className="flex-row items-center mt-8">
          {newDpImage ? (
            <>
              <Text className="text-secondary-100" onPress={confirmNewDp}>
                Confirm{" "}
              </Text>
              <MaterialCommunityIcons
                name="thumb-up"
                size={18}
                color="#FF9C01"
              />
            </>
          ) : (
            <>
              <Text className="text-secondary-100" onPress={openPicker}>
                Choose a photo{" "}
              </Text>
              <Image
                source={icons.camera}
                resizeMode="contain"
                className="w-4 h-4"
              />
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => modalClose()}
          className="absolute top-3 right-3"
        >
          <Entypo name="cross" size={30} color="#FF9C01" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default DpChangeModal;
