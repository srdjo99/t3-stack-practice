import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useQueries } from "@tanstack/react-query";

import { useState, useEffect } from "react";

const Home = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;

  const firstPokemon = trpc.getPokemonById.useQuery({ id: first });
  console.log(firstPokemon);
  const secondPokemon = trpc.getPokemonById.useQuery({ id: second });
  console.log(secondPokemon);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="text-2xl text-center ">Which Pokemon is Rounder?</div>
      <div className="p-2" />
      <div className="flex items-center justify-between max-w-2xl p-8 border rounded">
        <div className="flex flex-col w-64 h-64">
          <img
            src={firstPokemon.data?.sprites.front_default}
            alt="first pokemon"
            className="w-full"
          />
          <div className="text-xl text-center capitalize mt-[-2rem]">
            {firstPokemon.data?.name}
          </div>
        </div>
        <div className="p-8">vs</div>
        <div className="flex flex-col w-64 h-64">
          <img
            src={secondPokemon.data?.sprites.front_default}
            alt="second pokemon"
            className="w-full"
          />
          <div className="text-xl text-center capitalize mt-[-2rem]">
            {secondPokemon.data?.name}
          </div>
        </div>
        <div className="p-2" />
      </div>
    </div>
  );
};

export default Home;
