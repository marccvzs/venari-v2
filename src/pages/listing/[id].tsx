import { useUser } from "@clerk/nextjs";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

import { api } from "~/utils/api";

const ListingView: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.listing.getById.useQuery({ id });

  const user = useUser();
  const { register, handleSubmit, reset } = useForm<{ message: string }>();

  const sendMessage = api.listing.sendMessage.useMutation();

  if (!data) return <div>No Listing</div>;

  return (
    <>
      <Head>
        <title>{`${data.name}`}</title>
      </Head>
      <main className="flex min-h-screen flex-col justify-center">
        <div className="container mx-auto flex flex-col gap-12">
          <h1 className="mt-12 pl-4 text-4xl">{data.name.toUpperCase()}</h1>
          <p>{data.description}</p>
          <p>{`$ ${data.price}`}</p>

          {user.isSignedIn && (
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit((formData) => {
                sendMessage
                  .mutateAsync({
                    message: formData.message,
                    listingId: data.id,
                  })
                  .then(reset());
              })}
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  {...register("message", { required: true })}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Send Message
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
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.listing.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ListingView;
