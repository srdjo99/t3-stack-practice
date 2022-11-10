import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/routers/_app";

import { useState, useEffect } from "react";
import type React from "react";

import Image from "next/image";
import Link from "next/link";

const Home = () => {
  const [ids, updateIds] = useState(getOptionsForVote);

  const [first, second] = ids;

  const firstPokemon = trpc.getPokemonById.useQuery({ id: first });
  const secondPokemon = trpc.getPokemonById.useQuery({ id: second });

  const voteMutation = trpc.castVote.useMutation();

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    // todo: fire mutation to persist changes
    updateIds(getOptionsForVote());
  };

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

  return (
    <div className="relative flex flex-col items-center justify-between w-screen h-screen">
      <div className="pt-8 text-2xl text-center">Which Pokemon is Rounder?</div>
      <div className="flex items-center justify-between max-w-2xl p-8 border rounded">
        {dataLoaded ? (
          <>
            <PokemonListing
              pokemon={firstPokemon.data}
              vote={() => voteForRoundest(first)}
            />
            <div className="p-8">vs</div>
            <PokemonListing
              pokemon={secondPokemon.data}
              vote={() => voteForRoundest(second)}
            />
            <div className="p-2"></div>
          </>
        ) : (
          <img src="/rings.svg" alt="loader" className="w-48" />
        )}
      </div>

      <div className="w-full pb-2 text-xl text-center ">
        <a href="https://github.com/srdjo99/t3-stack-practice">Github</a> |
        <Link href="/results">Results</Link>
      </div>
    </div>
  );
};

type PokemonOutput = inferRouterOutputs<AppRouter>;
type PokemonFromServer = PokemonOutput["getPokemonById"];

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col">
      <Image
        src={props.pokemon.spriteUrl}
        alt="first pokemon"
        className="w-64 h-64"
        width={256}
        height={256}
        layout="fixed"
      />
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button onClick={() => props.vote()}>Rounder</button>
    </div>
  );
};

export default Home;
