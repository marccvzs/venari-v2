import Head from "next/head";
import { useForm } from 'react-hook-form';
import { api } from "~/utils/api";

type ListHuntForm = {
    name: string;
    description: string;
    price: number;
};

export default function ListHunt() {
const createListing = api.listing.create.useMutation();
const { register, handleSubmit } = useForm<ListHuntForm>();
const onSubmit = (formData: ListHuntForm) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    createListing.mutateAsync({
        ...formData,
    });
};

  return (
    <>
      <Head>
        <title>List a Hunt</title>
      </Head>
      <main className="flex bg-slate-700 min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <form 
                className="flex flex-col gap-4"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>
                    <label
                        htmlFor="name" 
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Item name
                    </label>
                    <input
                        id="name"
                        { ...register("name", { required: true })} 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                    <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        { ...register("description", { required: true })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                    <label
                        htmlFor="price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Price
                    </label>
                    <input
                        type="number" 
                        step="0.01" 
                        id="price" 
                        { ...register("price", { required: true })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Create</button>
            </form>
        </div>
      </main>
    </>
  );
};
