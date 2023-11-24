import { useEffect, useRef, useState } from "react";
import { Linking, Platform, BackHandler, AppState } from "react-native";
import { WebView } from "react-native-webview";
import CookieManager, { Cookies } from "@react-native-cookies/cookies";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as SplashScreen from "expo-splash-screen";
import * as Device from "expo-device";
import { WebviewWrapper } from "./components/WebviewWrapper";

SplashScreen.preventAutoHideAsync();

// iOS Simulator localhost
const BASE_URL = "http://127.0.0.1:3000";

// Android Emulator localhost
// const BASE_URL = "http://10.0.2.2:3000";

const handleDownloadBase64 = async ({ filename, data }) => {
  // When the filename contains spaces the process will fail
  const fileUri = `${FileSystem.documentDirectory}/${filename.replace(
    / /g,
    "_"
  )}`;

  await FileSystem.writeAsStringAsync(fileUri, data, {
    encoding: FileSystem.EncodingType.Base64,
  });
  Sharing.shareAsync(fileUri);
};

const injectedJavaScript = `
  document.body.style.backgroundColor = 'lightgray';
  true;
`;

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Handle hiding the splash screen
  useEffect(() => {
    if (loading) return;
    // Wait a bit before hiding the splash screen to avoid flickering
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 200);

    return () => clearTimeout(timer);
  }, [loading]);

  // Handle Android back button
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const handleBack = () => {
      if (!webViewRef.current) return false;
      webViewRef.current.goBack();
      return true;
    };

    const handleEvent = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBack
    );
    return () => handleEvent.remove();
  }, []);

  // Handle cookies on Android
  useEffect(() => {
    if (Platform.OS !== "android" || !Device.isDevice) return;
    const flushCookies = async () => CookieManager.flush();
    const event = AppState.addEventListener("change", flushCookies);
    return () => event.remove();
  }, []);

  // Save cookies on iOS
  useEffect(() => {
    if (Platform.OS !== "ios" || !Device.isDevice) return;
    const saveCookies = async () => {
      const cookies = await CookieManager.get(BASE_URL, true);
      AsyncStorage.setItem("cookies", JSON.stringify(cookies));
    };
    const event = AppState.addEventListener("change", saveCookies);
    return () => event.remove();
  }, []);

  // Load cookies on iOS
  useEffect(() => {
    if (Platform.OS !== "ios") return setIsReady(true);
    (async () => {
      const cookiesString = await AsyncStorage.getItem("cookies");
      const cookies: Cookies = JSON.parse(cookiesString || "{}");
      Object.values(cookies).forEach((cookie) => {
        CookieManager.set(BASE_URL, cookie, true);
      });

      setIsReady(true);
    })();
  }, []);

  if (!isReady) return null;

  return (
    <WebviewWrapper>
      <WebView
        ref={webViewRef}
        source={{
          uri: BASE_URL,
        }}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
        userAgent={`webview-${Platform.OS}`}
        onLoadEnd={() => setLoading(false)}
        onMessage={async ({ nativeEvent }) => {
          const { data } = nativeEvent;
          const parsedData = JSON.parse(data);
          if (Object.hasOwn(parsedData, "filename")) {
            await handleDownloadBase64(parsedData);
            return;
          }
        }}
        onShouldStartLoadWithRequest={({ url }) => {
          if (url.startsWith(BASE_URL)) return true;
          WebBrowser.openBrowserAsync(url);
          return false;
        }}
        onFileDownload={({ nativeEvent }) => {
          if (nativeEvent.downloadUrl) {
            // This will open the file in a default browser
            Linking.openURL(nativeEvent.downloadUrl);
          }
        }}
      />
    </WebviewWrapper>
  );
}
