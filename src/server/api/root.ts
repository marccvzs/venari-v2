import { listingsRouter } from "~/server/api/routers/listings";
import { vendorProfileRouter } from "~/server/api/routers/vendorProfile";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  listing: listingsRouter,
  vendorProfile: vendorProfileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
