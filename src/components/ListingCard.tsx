import type { RouterOutputs } from "~/utils/api";
import Link from "next/link";
import Image from "next/image";

type ListingWithVendor = RouterOutputs["listing"]["getAll"][number];
export const ListingCard = (props: ListingWithVendor) => {
  const { listing, vendor } = props;
  console.log(vendor);
  return (
    <div className="h-85 container max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <Link href={`/${vendor.username}`}>
        <Image
          className="rounded-t-lg"
          src={vendor.profilePicture}
          alt={vendor.username}
          width={56}
          height={56}
        />
      </Link>
      <div className="p-5">
        <Link href={`/listing/${listing.id}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {listing.name}
          </h5>
          <Link href={`/${vendor.username}`}>
            <span>{`by ${vendor.username}`}</span>
          </Link>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {listing.description}
        </p>
        <p className="mb-3  font-normal text-gray-700 dark:text-gray-400">
          {`$ ${listing.price}`}
        </p>
        <Link
          href={`/listing/${listing.id}`}
          className="inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          View
          <svg
            className="ml-2 h-3.5 w-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};
