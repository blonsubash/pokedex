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

const PokemonLists: FC = () => {
  const [allPokemonLists, setAllPokemonLists] = useState<PokemonList[]>([]);
  const [allPokemonListsLoading, setAllPokemonListsLoading] =
    useState<boolean>(false);
  const [pokemonName, setPokemonName] = useState("");
  const [filteredPokemonList, setFilteredPokemonList] =
    useState(allPokemonLists);
  const [habitatsList, setHabitatsList] = useState([]);
  const [pokemonTypeList, setPokemonTypeList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const handlePokemonSearchByPokemonName = (e) => {
    setPokemonName(e.target.value);
  };

  useEffect(() => {
    if (pokemonName === "") {
      setFilteredPokemonList(allPokemonLists);
    } else {
      const newArray = allPokemonLists.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(pokemonName.toLowerCase())
      );
      setFilteredPokemonList(newArray);
    }
  }, [pokemonName, allPokemonLists]);

  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        setAllPokemonListsLoading(true);
        const response = await axios.get(LIST_ALL_POKEMONS_URL);
        const { results } = response.data;

        const habitats: string[] = [];
        const regions: string[] = [];
        const pokemonTypesSet = new Set();

        const pokemonWithDetails = await Promise.all(
          results?.map(async (pokemon: PokemonList) => {
            const pokemonResponse = await axios.get(pokemon.url);
            const speciesResponse = await axios.get(
              pokemonResponse.data.species.url
            );
            const { sprites, types } = pokemonResponse.data;
            const pokemonTypes = types?.map(
              (type: PokemonTypes) => type.type.name
            );
            pokemonTypes.forEach((type: string) => {
              if (!types.includes(type)) {
                pokemonTypesSet.add(type);
              }
            });

            const habitat = speciesResponse.data.habitat.name;
            if (!habitats.includes(habitat)) {
              habitats.push(habitat);
            }

            const regionUrl = speciesResponse.data.generation.url;
            const regionResponse = await axios.get(regionUrl);
            const region = regionResponse.data.main_region.name;
            if (!regions.includes(region)) {
              regions.push(region);
            }

            return {
              ...pokemon,
              image: sprites.front_default,
              types: pokemonTypes,
              habitat: habitat,
              region: region,
            };
          })
        );

        setAllPokemonLists(pokemonWithDetails);
        setAllPokemonListsLoading(false);
        setHabitatsList(habitats);
        setPokemonTypeList(Array.from(pokemonTypesSet));
        setRegionList(regions);
      } catch (error) {
        setAllPokemonListsLoading(false);
        showToastError("Server Error. Please Try Again");
      }
    }

    fetchAllPokemon();
  }, []);
  console.log("allPokemonLists", allPokemonLists);
  console.log("regions", regionList);
  console.log("typelist", pokemonTypeList);
  console.log("habitat", habitatsList);
  const [selectedType, setSelectedType] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedHabitat, setSelectedHabitat] = useState("");
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setSelectedType(selectedType);
    if (selectedType === "All") {
      setFilteredPokemonList(allPokemonLists);
    } else {
      const filteredPokemon = allPokemonLists.filter((pokemon) =>
        pokemon.types.includes(selectedType)
      );
      setFilteredPokemonList(filteredPokemon);
    }
  };

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setSelectedRegion(selectedRegion);
    if (selectedRegion === "All") {
      setFilteredPokemonList(allPokemonLists);
    } else {
      const filteredPokemon = allPokemonLists.filter((pokemon) =>
        pokemon.region.includes(selectedRegion)
      );
      setFilteredPokemonList(filteredPokemon);
    }
  };

  const handleHabitatChange = (e) => {
    const selectedHabitat = e.target.value;
    setSelectedHabitat(selectedHabitat);
    if (selectedHabitat === "All") {
      setFilteredPokemonList(allPokemonLists);
    } else {
      const filteredPokemon = allPokemonLists.filter((pokemon) =>
        pokemon.habitat.includes(selectedHabitat)
      );
      setFilteredPokemonList(filteredPokemon);
    }
  };
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
        <div>
          <div className="header-section">
            <div className="section-search">
              <input
                placeholder="Search Pokemon..."
                onChange={(e) => handlePokemonSearchByPokemonName(e)}
              />
            </div>
            <div className="section-filter">
              <div>
                <label htmlFor="typeSelect">Select Type </label>
                <select onChange={handleTypeChange} value={selectedType}>
                  <option value="All">All</option>
                  {pokemonTypeList.map((type, index) => (
                    <option key={index} value={type}>
                      {getNamePascalCase(type)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="typeSelect">Select Region </label>

                <select onChange={handleRegionChange} value={selectedRegion}>
                  <option value="All">All</option>
                  {regionList.map((type, index) => (
                    <option key={index} value={type}>
                      {getNamePascalCase(type)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="typeSelect">Select Habitat </label>

                <select onChange={handleHabitatChange} value={selectedHabitat}>
                  <option value="All">All</option>
                  {habitatsList.map((type, index) => (
                    <option key={index} value={type}>
                      {getNamePascalCase(type)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="container__all-lists">
            {filteredPokemonList?.map((pokemon, index) => (
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
                <div className="pokemon-region-kanto">
                  <div>
                    <p>Region: {getNamePascalCase(pokemon?.region)}</p>
                  </div>
                  <div>
                    <p>Habitat: {getNamePascalCase(pokemon?.habitat)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonLists;
