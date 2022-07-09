import "../../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { MainProvider } from "../MainContext";
import { MySubsProvider } from "../MySubs";
import { MyCollectionsProvider } from "../components/collections/CollectionContext";

import Script from "next/script";
import Head from "next/head";

import toast, { Toaster } from "react-hot-toast";
import NavBar from "../components/NavBar";
import { useEffect } from "react";
import packageInfo from "../../package.json"
import { checkVersion } from "../../lib/utils";
import ToastCustom from "../components/toast/ToastCustom";
const VERSION = packageInfo.version
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const curVersion = VERSION;
    let compare = checkVersion(
      curVersion,
      localStorage.getItem("nottitVersion") ?? ""
    );
    if (compare === 1) {
      localStorage.setItem("nottitVersion", curVersion);
      const toastId = toast.custom(
        (t) => (
          <ToastCustom
            t={t}
            message={`Nottit has updated! Click to see changelog`}
            mode={"version"}
          />
        ),
        { position: "bottom-center", duration: 8000 }
      );
    }
  }, []);
  return (
    <>
      <Script defer data-domain={"nottit.com"} src="/js/script.js"></Script>

      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={pageProps.session}>
        <ThemeProvider  defaultTheme="system">
          <MainProvider>
            <MySubsProvider>
              <MyCollectionsProvider>
                <NavBar />
                <div className="mb-16"></div>
                <Component {...pageProps} />
                <Toaster position="bottom-center" />
              </MyCollectionsProvider>
            </MySubsProvider>
          </MainProvider>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
