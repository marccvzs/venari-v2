import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import type { Listing } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { filterVendorsForClient } from "~/server/helpers/filterVendorsForClient";
import { TRPCError } from "@trpc/server";
// import { Ratelimit } from "@upstash/ratelimit";

const addVendorDataToListings = async (listings: Listing[]) => {
  const vendors = (
    await clerkClient.users.getUserList({
      userId: listings.map((listing) => listing.vendorId),
      limit: 50,
    })
  ).map(filterVendorsForClient);

  return listings.map((listing) => {
    const vendor = vendors.find((user) => user.id === listing.vendorId);

    if (!vendor?.username)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Vendor for listing not found",
      });

    return {
      listing,
      vendor: {
        ...vendor,
        username: vendor.username,
      },
    };
  });
};

// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(10, "1 m"),
//   analytics: true,
//   prefix: "@upstash/ratelimit",
// });

export const listingsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const listings = await ctx.prisma.listing.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    return addVendorDataToListings(listings);
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.listing.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  sendMessage: protectedProcedure
    .input(z.object({ message: z.string().max(255), listingId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const message = await ctx.prisma.message.create({
        data: {
          fromUser: "",
          fromUserName: ctx.userId,
          listingId: input.listingId,
          message: input.message,
        },
      });
      return message;
    }),
  getMessage: protectedProcedure.query(async ({ ctx }) => {
    const listing = await ctx.prisma.listing.findMany({
      where: {
        vendorId: ctx.userId,
      },
      include: {
        message: true,
      },
    });
    return listing.flatMap((item) => item.message);
  }),
  getListingsByVendorId: publicProcedure
    .input(
      z.object({
        vendorId: z.string(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.prisma.listing
        .findMany({
          where: {
            vendorId: input.vendorId,
          },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addVendorDataToListings),
    ),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const vendorId = ctx.userId;
      // TODO save something to the db
      const listing = await ctx.prisma.listing.create({
        data: {
          ...input,
          vendorId,
        },
      });
      return listing;
    }),
});
