import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { ListingCard } from "~/components/ListingCard";
import { LoadingPage } from "~/components/loading";

const ProfileFeed = (props: { vendorId: string }) => {
    const { data, isLoading } = api.listing.getListingsByVendorId.useQuery({ vendorId: props.vendorId });

    if (isLoading) return <LoadingPage />;

    if (!data || data.length === 0) return <div>No Listings</div>;

    return (
        <div className="flex flex-col">
            {data.map((fullListing) => (<ListingCard {...fullListing} key={fullListing.listing.id} />))}
        </div>
    )
}

const VendorPage: NextPage<{ username: string }> = ({ username }) => {
    const { data } = api.vendorProfile.getVendorByUsername.useQuery({
        username,
    });

    if (!data) return <div>No Profile</div>;

    return (
        <>
            <Head>
                <title>{data.username}</title>
            </Head>
            <div className="container h-screen">
                <h1>{data.username}</h1>
                <ProfileFeed vendorId={data.id} />
            </div>
        </>
    )
};

export const getStaticProps: GetStaticProps = async (context) => {
    const ssg = generateSSGHelper();

    const slug = context.params?.slug;

    if (typeof slug !== 'string') throw new Error("no slug");

    const username = slug;

    await ssg.vendorProfile.getVendorByUsername.prefetch({ username });

    return {
        props: {
            trpcState: ssg.dehydrate(),
            username,
        },
    };
};

export const getStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
};

export default VendorPage;