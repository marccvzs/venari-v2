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
  getById: publicProcedure
  .input(z.object({ id: z.string()}))
  .query(({ ctx, input }) => {
    return ctx.prisma.listing.findUnique({
      where: {
        id: input.id
      }
    })
  }),
  sendMessage: protectedProcedure
  .input(
    z.object({ message: z.string().max(255), listingId: z.string() })
  )
  .mutation(async ({ input, ctx }) => {
    const message = await ctx.prisma.message.create({
      data: {
        fromUser: '',
        fromUserName: ctx.userId,
        listingId: input.listingId,
        message: input.message,
    },
  });
    return message;
  }),
  create: protectedProcedure
    .input(
      z.object({ name: z.string(), description: z.string(), price: z.number() })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;
      // TODO save something to the db
      const listing = await ctx.prisma.listing.create({
        data: {
          ...input,
          userId,
      },
    })
      return listing;
    })
});
