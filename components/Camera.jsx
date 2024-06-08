import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  
  SafeAreaView,
  
} from "react-native";
import { CameraView } from "expo-camera";
import { icons } from "../constants";
import { StatusBar } from "expo-status-bar";

import * as FileSystem from "expo-file-system";
import  mime from "mime";

import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

const Camera = ({ closeCamera }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [facing, setFacing] = useState("back");
  const cameraRef = useRef(null);

  const handleRecord = async () => {
    let video;
    try {
      if (cameraRef.current) {
        if (isRecording) {
          cameraRef.current.stopRecording();
        } else {
          setIsRecording(true);
          video = await cameraRef.current.recordAsync();
          const videoMetadata = await getVideoMetadata(video.uri);
          closeCamera(videoMetadata);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getVideoMetadata = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileName = uri.split("/").pop();
      const fileSize = fileInfo.size;
      const mimeType = mime.getType(fileName);
      return { uri, fileName, fileSize, mimeType };
    } catch (error) {
      console.error("Error getting file metadata:", error);
      return null;
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  return (
    <SafeAreaView className="flex-1">
      <CameraView
        mode="video"
        ref={cameraRef}
        className="flex-1 relative"
        facing={facing}
      >
        <TouchableOpacity
          onPress={closeCamera}
          className="text-white text-base absolute top-10 left-4"
        >
          <AntDesign name="back" size={25} color="white" />
        </TouchableOpacity>
        <View className=" absolute bottom-10 flex flex-row items-center bg-transparent left-[38%]">
          <TouchableOpacity
            className="bg-white rounded-full justify-center items-center mr-16 w-[75px] h-[75px]"
            onPress={handleRecord}
          >
            {isRecording ? (
              <View className="bg-black rounded-md w-7 h-7" />
            ) : (
              <View className="bg-red-700 rounded-full w-7 h-7" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-transparent"
            onPress={toggleCameraFacing}
          >
            <FontAwesome6 name="arrows-rotate" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
      <StatusBar backgroundColor={"transparent"} translucent />
    </SafeAreaView>
  );
};

export default Camera;
