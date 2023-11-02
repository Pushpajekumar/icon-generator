import { and, desc, eq, gte, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { icons, users } from "~/server/db/schema";

export const collectionRouter = createTRPCRouter({
  getMyCollection: protectedProcedure.query(async ({ ctx }) => {
    const myIcons = ctx.db
      .select()
      .from(icons)
      .where(eq(icons.userId, ctx.session.user.id));
    const mySelectedIcons = await myIcons.orderBy(desc(icons.createdAt));
    await ctx.db
      .update(users)
      .set({
        credits: 50,
      })
      .where(eq(users.id, ctx.session.user.id));
    const myUrl = mySelectedIcons.map((icon) => {
      const iconId = icon.id.toString();
      const url = `https://icon-generator2130.s3.amazonaws.com/${iconId}`;
      return url;
    });
    return myUrl;
  }),
});
