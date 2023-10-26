import { createTRPCRouter } from "~/server/api/trpc";
import { openaiRouter } from "./routers/generate";
import { collectionRouter } from "./routers/collection";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  openai: openaiRouter,
  collection: collectionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
