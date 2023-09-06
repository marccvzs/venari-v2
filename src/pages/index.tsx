import type { NextPage } from "next";
import { ListingCard } from "~/components/ListingCard";
import { LoadingPage } from "~/components/loading";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data, isLoading: listingsLoading } = api.listing.getAll.useQuery();

  if (listingsLoading) return <LoadingPage />;

  if (!data) return <div>No Listings</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="bg-[url('https://www.shutterstock.com/image-photo/hunting-tower-valley-morning-mists-260nw-1172889934.jpg')]">
        <h1 className="text-4xl">Explore Hunting Grounds Near You</h1>
      </div>
      <div className="container grid grid-cols-3 items-center justify-center gap-12 px-4 py-16 ">
        {data?.map((listing) => (
          <ListingCard {...listing} key={listing.listing.id} />
        ))}
      </div>
    </main>
  );
};

export default Home;
