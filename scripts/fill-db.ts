import { PokemonClient } from "pokenode-ts";

import { prisma } from "@/server/utils/prisma";

const dbBackfill = async () => {
  const pokeApi = new PokemonClient();

  const allPokemon = await pokeApi.listPokemons(0, 493);

  console.log("pokemon?", allPokemon);
  // const creation = prisma.pokemon.createMany({
  //   // data: allPokemon.results.map((p) => {
  //   //   return { name: p.url };
  //   // }),
  // });
};

dbBackfill();
