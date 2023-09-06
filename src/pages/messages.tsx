import type { NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const Messages: NextPage = () => {
  const { data } = api.listing.getMessage.useQuery();

  if (!data) return <div>No Listings</div>

  return (
    <>
      <Head>
        <title>Messages</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl">Hunts Available</h1>
        <div className="container grid grid-cols-3 items-center justify-center gap-12 px-4 py-16 ">
          {data?.map((message) => <div key={message.id}>{message.message}</div>)}
        </div>
      </main>
    </>
  );
};

export default Messages;
