import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "~/server/api/trpc";

export const listingsRouter = createTRPCRouter({
  getAll: publicProcedure
  .query(async ({ ctx }) => {
      const listings = await ctx.prisma.listing.findMany({
        take: 100,
      });

    return listings;
  }),

  create: protectedProcedure
    .input(
      z.object({ name: z.string(), description: z.string(), price: z.number() })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO save something to the db
      const listing = await ctx.prisma.listing.create({
        data: {
          ...input,
          userId: ctx.auth.userId,
      },
    })
      return listing;
    })
});
