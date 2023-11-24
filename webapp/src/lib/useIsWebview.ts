import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export const useIsWebview = () => {
  const [isWebview, setIsWebview] = useState(false);
  const [{ webview: webviewValue }] = useCookies(["webview"]);

  useEffect(() => {
    setIsWebview(!!webviewValue);
  }, [webviewValue]);

  return isWebview;
};

export const useIsAndroidWebview = () => {
  const [isAndroid, setIsAndroid] = useState(false);
  const [{ webview: webviewValue }] = useCookies(["webview"]);

  useEffect(() => {
    setIsAndroid(webviewValue === "android");
  }, [webviewValue]);

  return isAndroid;
};

export const useIsIosWebview = () => {
  const [isIos, setIsIos] = useState(false);
  const [{ webview: webviewValue }] = useCookies(["webview"]);

  useEffect(() => {
    setIsIos(webviewValue === "ios");
  }, [webviewValue]);

  return isIos;
};
