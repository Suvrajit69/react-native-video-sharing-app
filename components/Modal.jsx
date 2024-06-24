import {
  KeyboardAvoidingView,
  Platform,
  Modal as RnModal,
  View,
} from "react-native";

const Modal = ({ children, isOpen, animation, withKeyBoard, ...props }) => {
  const content = withKeyBoard ? (
    <KeyboardAvoidingView
      className="bg-primary items-center justify-center flex-1 px-3"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View
      className=" items-center justify-center px-3 flex-1"
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
    >
      {children}
    </View>
  );

  return (
    <RnModal
      visible={isOpen}
      animationType={animation}
      transparent
      statusBarTranslucent
      {...props}
    >
      {content}
    </RnModal>
  );
};

export default Modal;
