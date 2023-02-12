// import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userAccountsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.userAccounts.findMany({
      where: { deletedAt: null },
    });
  }),
});
