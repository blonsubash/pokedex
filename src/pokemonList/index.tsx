import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import RotateLoader from "react-spinners/RotateLoader";

import "@/assets/sass/pokemonList";

import {
  getNamePascalCase,
  getPokemonTypeImages,
  showToastError,
} from "@/utils";
import { LIST_ALL_POKEMONS_URL } from "@/constants/apiConstants";

import { PokemonList, PokemonTypes } from "@/interface";
import { Pokemon_Type_Configs } from "@/constants/appConfig";

const PokemonLists: FC = () => {
  const [allPokemonLists, setAllPokemonLists] = useState<PokemonList[]>([]);
  const [allPokemonListsLoading, setAllPokemonListsLoading] =
    useState<boolean>(false);
  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        setAllPokemonListsLoading(true);
        const response = await axios.get(LIST_ALL_POKEMONS_URL);
        const { results } = response.data;
        const pokemonWithDetails = await Promise.all(
          results?.map(async (pokemon: PokemonList) => {
            const pokemonResponse = await axios.get(pokemon.url);
            const { sprites, types } = pokemonResponse.data;
            const pokemonTypes = types?.map(
              (type: PokemonTypes) => type.type.name
            );
            return {
              ...pokemon,
              image: sprites.front_default,
              types: pokemonTypes,
            };
          })
        );

        setAllPokemonLists(pokemonWithDetails);
        setAllPokemonListsLoading(false);
      } catch (error) {
        setAllPokemonListsLoading(false);
        showToastError("Server Error. Please Try Again");
      }
    }

    fetchAllPokemon();
  }, []);

  return (
    <div className="pokemon-lists__container">
      {allPokemonListsLoading ? (
        <RotateLoader
          color={"#000000"}
          loading={allPokemonListsLoading}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div className="container__all-lists">
          {allPokemonLists?.map((pokemon, index) => (
            <div key={index} className="all-lists__pokemon-detail">
              <img
                src={pokemon?.image}
                className="pokemon-detail__pokemon-img"
              />
              <h5>{getNamePascalCase(pokemon.name)}</h5>
              <div className="pokemon-detail__types">
                {/* {pokemon.types.forEach((pokemontype) => (
                  <p> {checkPokemontype(pokemontype)}</p>
                ))} */}

                {/* {getPokemonTypeImages(pokemon.types).map(
                  (typeImageSource, index) => (
                    <React.Fragment key={index}>
                      <img src={typeImageSource} />
                    
                    </React.Fragment>
                  )
                )} */}

                {/* <p>{checkPokemontype(pokemon.types)}</p> */}
                {pokemon.types.map((item, index) => (
                  <div key={index} className="types__single-type">
                    <img src={getPokemonTypeImages(item)} />
                    <p>{getNamePascalCase(item)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonLists;
