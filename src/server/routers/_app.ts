import { z } from "zod";
import { publicProcedure, router } from "../trpc";

import { prisma } from "@/server/utils/prisma";

export const appRouter = router({
  getPokemonById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const pokemon = await prisma.pokemon.findFirst({
        where: { id: input.id },
      });

      if (!pokemon) throw new Error("lol doesn't exist");
      return pokemon;
    }),

  castVote: publicProcedure
    .input(
      z.object({
        votedFor: z.number(),
        votedAgainst: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const voteInDb = await prisma.vote.create({
        data: {
          votedAgainstId: input.votedAgainst,
          votedForId: input.votedFor,
        },
      });
      return { success: true, vote: voteInDb };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
