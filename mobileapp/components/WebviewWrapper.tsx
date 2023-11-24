import { StatusBar } from "expo-status-bar";
import { ReactNode } from "react";
import {
  Platform,
  StyleSheet,
  SafeAreaView as SafeAreaViewIOS,
} from "react-native";
import { SafeAreaView as SafeAreaViewAndroid } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  appView: {
    flex: 1,
  },
});

type WebviewWrapperProps = {
  children: ReactNode;
};

export const WebviewWrapper = ({ children }: WebviewWrapperProps) => {
  const isIOS = Platform.OS === "ios";
  const SafeAreaView = isIOS ? SafeAreaViewIOS : SafeAreaViewAndroid;

  return (
    <SafeAreaView style={[styles.appView]}>
      <StatusBar hidden={false} />
      {children}
    </SafeAreaView>
  );
};
