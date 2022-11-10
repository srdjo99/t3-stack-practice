import type { GetServerSideProps } from "next";
import { prisma } from "@/server/utils/prisma";
import { FC } from "react";

import { AsyncReturnType } from "@/utils/ts-bs";
import { TypeOf } from "zod";
import Image from "next/image";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: { VoteFor: { _count: "desc" } },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const PokemonListing: FC<{ pokemon: PokemonQueryResult[number] }> = (props) => {
  return (
    <div className="flex items-center p-4 border-b">
      <Image
        src={props.pokemon.spriteUrl}
        width={64}
        height={64}
        layout="fixed"
        alt="image"
      />
      <div className="capitalize">{props.pokemon.name}</div>
    </div>
  );
};

const ResultsPage: FC<{
  pokemon: PokemonQueryResult;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="p-4 text-2xl">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {props.pokemon.map((currentPokemon, index) => {
          return <PokemonListing pokemon={currentPokemon} key={index} />;
        })}
      </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};
