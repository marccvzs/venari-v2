import { clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure
} from "~/server/api/trpc";
import { filterVendorsForClient } from '~/server/helpers/filterVendorsForClient';

export const vendorProfileRouter = createTRPCRouter({
  getVendorByUsername: publicProcedure.input(
    z.object({ username: z.string() }))
    .query(async({ input }) => {
        const [vendor] = await clerkClient.users.getUserList({
            username: [input.username],
        });

        if (!vendor) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "User not found",
            });
        }

        return filterVendorsForClient(vendor);
    })
});
