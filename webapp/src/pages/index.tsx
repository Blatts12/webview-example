import PullToRefresh from "react-simple-pull-to-refresh";
import { Inter } from "next/font/google";
import { useIsAndroidWebview, useIsIosWebview } from "@/lib/useIsWebview";
import { useRouter } from "next/router";

type WindowWithWebView = Window & {
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
};

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { reload } = useRouter();

  const isIosWebview = useIsIosWebview();
  const isAndroidWebview = useIsAndroidWebview();
  const isNotWebview = !isIosWebview && !isAndroidWebview;

  const handleDownloadBase64 = () => {
    if ((window as WindowWithWebView).ReactNativeWebView) {
      const filename = "test.txt";
      const data = "dGVzdA==";
      const message = JSON.stringify({ filename, data });
      (window as WindowWithWebView).ReactNativeWebView?.postMessage(message);
    }
  };

  const handlePTR = async () => {
    reload();
  };

  return (
    <PullToRefresh
      onRefresh={handlePTR}
      pullingContent={
        <div className="flex justify-center items-end w-screen">
          <p>Pull more to refresh</p>
        </div>
      }
    >
      <main
        className={`flex min-h-screen flex-col gap-2 p-2 ${inter.className}`}
      >
        <h1 className="text-2xl">Demo app</h1>
        <p>Pull to refresh {";-)"}</p>
        <p>
          Current env: {isIosWebview ? <span>iOS Webview</span> : null}
          {isAndroidWebview ? <span>Android Webview</span> : null}
          {isNotWebview ? <span>Browser</span> : null}
        </p>

        <div className="bg-black h-2 shadow" />

        <h2 className="text-lg">File upload</h2>
        <input type="file" multiple />

        <div className="bg-black h-2 shadow" />

        <h2 className="text-lg">File download</h2>
        <a href="/api/download" className="underline">
          Download file
        </a>
        <button
          className="bg-emerald-800 text-white px-4 py-2 rounded shadow"
          onClick={handleDownloadBase64}
        >
          Download Base64 file
        </button>

        <div className="bg-black h-2 shadow" />

        <h2 className="text-lg">OS integrated browser</h2>
        <a href="https://google.com" className="underline">
          Go to external page
        </a>

        <div className="bg-black h-2 shadow" />
      </main>
    </PullToRefresh>
  );
}

export const getServerSideProps = async () => {
  return { props: {} };
};
