import type { Listing } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const Card = ({ listing }: { listing: Listing}) => {
  return (
    <div className="h-60 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
            <img className="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
        </a>
        <div className="p-5">
            <Link href={`/listing/${listing.id}`}>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{listing.name}</h5>
            </Link>
            <p className="h-28 mb-3 font-normal text-gray-700 dark:text-gray-400">{listing.description}</p>
            <Link href={`/listing/${listing.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                View
                <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </Link>
        </div>
    </div>

  );
};

const Home: NextPage = () => {
  const { data, isLoading: listingsLoading } = api.listing.getAll.useQuery();
  
  if (listingsLoading) return <div>Loading...</div>

  if (!data) return <div>No Listings</div>

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#AE8E7E] to-[#54504A]">
        <h1 className="text-4xl">Hunts Available</h1>
        <div className="container grid grid-cols-3 items-center justify-center gap-12 px-4 py-16 ">
          {data?.map((listing) => <Card key={listing.id} listing={listing} />)}
        </div>
      </main>
    </>
  );
};

export default Home;
