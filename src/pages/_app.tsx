import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { NavBar } from "~/components/NavBar";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { Search } from "~/components/search";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Venari</title>
        <meta name="description" content="Book your next hunt with us!" />
      </Head>
      <>
        <NavBar />
          <Search />
        <Toaster position="bottom-center" />
        <Component {...pageProps} />
      </>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
