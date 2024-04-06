import axios from "axios";
import { useParams } from "react-router";
import { DotLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "@/assets/sass/pokemonDetail";

import { PokemonDetail, PokemonTypeColorMap } from "@/interface";
import {
  POKEMON_BASE_API_VERSION,
  POKEMON_BASE_URL,
} from "@/constants/apiConstants";
import {
  getColorForPokemonType,
  getNamePascalCase,
  getPokemonTypeImages,
  showToastError,
} from "@/utils";
import {
  ArrowRightIcon,
  BackIcon,
  FemaleIcon,
  MaleIcon,
} from "@/assets/images/global";

const PokemonDetailPage = () => {
  const navigation = useNavigate();

  const { pokemonId } = useParams();
  const [pokemonData, setPokemonData] = useState<PokemonDetail>();
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonType, setPokemonType] = useState("");

  const extractEvolutionData = async (chain: any): Promise<any[]> => {
    const evolutionData: any[] = [];

    const traverse = async (node: any, path: any[]) => {
      const currentPokemon = node.species.name;
      const evolvesTo = node.evolves_to;

      if (evolvesTo.length === 0) {
        evolutionData.push({
          evolvesFrom: path.map((p: any) => p.species.name).join(" -> "),
          evolvesTo: currentPokemon,
          evolvesToImage: await getPokemonImage(currentPokemon),
          minLevel: null,
        });
      } else {
        for (const evolution of evolvesTo) {
          const details = evolution.evolution_details[0];

          evolutionData.push({
            evolvesFrom: path.map((p: any) => p.species.name).join(" -> "),
            evolvesTo: currentPokemon,
            evolvesToImage: await getPokemonImage(currentPokemon),
            minLevel: details.min_level ? details.min_level : null,
          });

          await traverse(evolution, [...path, node]);
        }
      }
    };

    await traverse(chain, []);
    return evolutionData;
  };

  const getPokemonImage = async (
    pokemonName: string
  ): Promise<string | null> => {
    try {
      const speciesUrl = `${POKEMON_BASE_URL}${POKEMON_BASE_API_VERSION}pokemon-species/${pokemonName}`;
      const speciesResponse = await axios.get(speciesUrl);
      const speciesData = speciesResponse.data;
      const pokemonId = speciesData.id;
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
    } catch (error) {
      showToastError("Server Error. Please try again");
      return null;
    }
  };

  const convertPokemonHeightIntoMetre = (height: number) => {
    if (!height) return 0;
    return height / 10;
  };

  const convertPokemonWeightIntoKg = (weight: number) => {
    if (!weight) return 0;
    return weight / 10;
  };

  useEffect(() => {
    if (pokemonId) {
      async function fetchPokemonDetail() {
        try {
          setIsLoading(true);
          const pokemonDetailUrl = `${POKEMON_BASE_URL}${POKEMON_BASE_API_VERSION}pokemon/${pokemonId}`;
          const pokemonDetailResponse = await axios.get(pokemonDetailUrl);

          const speciesUrl = pokemonDetailResponse.data.species.url;

          const speciesResponse = await axios.get(speciesUrl);

          const speciesData = {
            genus: speciesResponse.data.genera.find(
              (genus: any) => genus.language.name === "en"
            ).genus,
          };
          const eggGroups = speciesResponse.data.egg_groups.map(
            (group: any) => group.name
          );
          const genderDistribution = {
            male: speciesResponse.data.gender_rate * 12.5,
            female: (8 - speciesResponse.data.gender_rate) * 12.5,
          };
          const eggCycles = speciesResponse.data.hatch_counter;

          const trainingData = {
            catchRate: speciesResponse.data.capture_rate,
            baseFriendship: speciesResponse.data.base_happiness,
            baseExperience: speciesResponse.data.base_experience,
            growthRate: speciesResponse.data.growth_rate.name,
          };

          const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
          const evolutionChainResponse = await axios.get(evolutionChainUrl);
          const evolutionData = await extractEvolutionData(
            evolutionChainResponse.data.chain
          );

          const movesData = await Promise.all(
            pokemonDetailResponse.data.moves.map(async (move: any) => {
              const moveUrl = move.move.url;
              const moveResponse = await axios.get(moveUrl);

              return {
                name: move.move.name,
                category: move.version_group_details[0].move_learn_method.name,
                type: moveResponse.data.type.name,
                power: moveResponse.data.power,
                accuracy: moveResponse.data.accuracy,
                pp: moveResponse.data.pp,
              };
            })
          );

          setPokemonData({
            ...pokemonDetailResponse.data,
            speciesData: speciesData,
            evolutionData: evolutionData,
            breedingData: {
              eggGroups: eggGroups,
              genderDistribution: genderDistribution,
              eggCycles: eggCycles,
            },
            trainingData: trainingData,
            movesData: movesData,
          });

          setPokemonType(pokemonDetailResponse?.data?.types?.[0]?.type?.name);
          setIsLoading(false);
        } catch {
          showToastError("Server Error. Please Try Again");
          setIsLoading(false);
        }
      }
      fetchPokemonDetail();
    }
  }, [pokemonId]);

  return (
    <div className="pokemon__all-detail">
      {isLoading ? (
        <div className="custom-loader">
          <DotLoader
            color={"#6750a4"}
            loading={isLoading}
            size={100}
            aria-label="Loading..."
            data-testid="loader"
          />
        </div>
      ) : (
        <div>
          <div className="all-detail__title">
            <div
              className="back-to-list"
              style={{
                backgroundColor: getColorForPokemonType(
                  pokemonType as keyof PokemonTypeColorMap
                ),
              }}
              onClick={() => navigation("/")}
            >
              <img src={BackIcon} />
            </div>
            <h1>{pokemonData?.name?.toUpperCase()}</h1>
            <div className="pokemon__name">
              <p
                style={{
                  backgroundColor: getColorForPokemonType(
                    pokemonType as keyof PokemonTypeColorMap
                  ),
                }}
              >
                {pokemonData?.speciesData?.genus}
              </p>
            </div>
          </div>
          <div className="all-detail__stats">
            <div className="stats__info">
              <div>
                <strong>Height</strong>
                <p>{convertPokemonHeightIntoMetre(pokemonData?.height!)} m</p>
              </div>
              <div>
                <strong>Weight</strong>
                <p>{convertPokemonWeightIntoKg(pokemonData?.weight!)} kg</p>
              </div>
              <div>
                <strong>Abilities</strong>
                {pokemonData?.abilities?.map((abilityItem, abilityIndex) => (
                  <p
                    key={abilityIndex}
                    className="info__ability"
                    style={{
                      backgroundColor: getColorForPokemonType(
                        pokemonType as keyof PokemonTypeColorMap
                      ),
                    }}
                  >
                    {getNamePascalCase(abilityItem?.ability?.name)?.replace(
                      "-",
                      " "
                    )}
                  </p>
                ))}
              </div>
              <div>
                <strong>Type</strong>
                {pokemonData?.types?.map((typeName, typeIndex) => (
                  <p
                    key={typeIndex}
                    style={{
                      backgroundColor: getColorForPokemonType(
                        typeName?.type?.name as keyof PokemonTypeColorMap
                      ),
                    }}
                    className="info__type"
                  >
                    <img src={getPokemonTypeImages(typeName?.type?.name)} />

                    {getNamePascalCase(typeName?.type?.name)}
                  </p>
                ))}
              </div>
              <div>
                <strong>Forms</strong>
                {pokemonData?.forms?.map((formName, formIndex) => (
                  <p key={formIndex}>{getNamePascalCase(formName?.name)}</p>
                ))}
              </div>
            </div>
            <div className="stats__image">
              <img
                src={pokemonData?.sprites?.other?.dream_world?.front_default}
              />
            </div>
            <div className="stats__power">
              {pokemonData?.stats?.map((statsItem, statsIndex) => (
                <div key={statsIndex}>
                  <strong>
                    {getNamePascalCase(statsItem?.stat?.name)?.replace(
                      "-",
                      " "
                    )}
                  </strong>
                  <div className="stat-bar">
                    <div
                      className="stat-fill"
                      style={{
                        width: `${(statsItem.base_stat / 100) * 100}%`,
                        backgroundColor: getColorForPokemonType(
                          pokemonType as keyof PokemonTypeColorMap
                        ),
                      }}
                    >
                      {statsItem?.base_stat}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pokemon__evolution">
            <div className="evolution__title">
              <h1
                style={{
                  backgroundColor: getColorForPokemonType(
                    pokemonType as keyof PokemonTypeColorMap
                  ),
                }}
              >
                EVOLUTION CHAIN
              </h1>
            </div>
            <div className="evolution__story">
              {pokemonData?.evolutionData?.map(
                (evolutionItem, evolutionIndex) => (
                  <div key={evolutionIndex} className="story__pokemon">
                    <img
                      src={evolutionItem.evolvesToImage}
                      className="pokemon__image"
                    />
                    <p
                      className="pokemon__name"
                      style={{
                        backgroundColor: getColorForPokemonType(
                          pokemonType as keyof PokemonTypeColorMap
                        ),
                      }}
                    >
                      {evolutionItem?.evolvesTo.toUpperCase()}
                    </p>
                    {evolutionItem?.minLevel && (
                      <div className="pokemon__min-level">
                        <p className="pokemon__min-level-count">{`Level ${
                          evolutionItem?.minLevel ?? ""
                        } + `}</p>
                        <img src={ArrowRightIcon} />
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="pokemon__breeding-training-data">
            <div className="breeding-data">
              <h5>BREEDING</h5>
              <div>
                <strong>Egg Cycles</strong>
                <p
                  style={{
                    color: getColorForPokemonType(
                      pokemonType as keyof PokemonTypeColorMap
                    ),
                  }}
                >
                  {pokemonData?.breedingData?.eggCycles}
                </p>
              </div>
              <div>
                <strong>Egg Groups</strong>
                <p
                  style={{
                    color: getColorForPokemonType(
                      pokemonType as keyof PokemonTypeColorMap
                    ),
                  }}
                >
                  {pokemonData?.breedingData?.eggGroups}
                </p>
              </div>
              <div>
                <strong>Gender Distribution</strong>
                <div className="gender-section">
                  <p style={{ color: "#50C7EF" }}>
                    {pokemonData?.breedingData?.genderDistribution?.male}%{" "}
                  </p>
                  <img src={MaleIcon} />
                  <p style={{ color: "#EF687E" }}>
                    {pokemonData?.breedingData?.genderDistribution?.female}%
                  </p>
                  <img src={FemaleIcon} />
                </div>
              </div>
            </div>
            <div className="training-data">
              <h5>TRAINING</h5>
              <div>
                <strong>Catch Rate</strong>
                <p
                  style={{
                    color: getColorForPokemonType(
                      pokemonType as keyof PokemonTypeColorMap
                    ),
                  }}
                >
                  {pokemonData?.trainingData?.catchRate}
                </p>
              </div>
              <div>
                <strong>Base Friendship</strong>
                <p
                  style={{
                    color: getColorForPokemonType(
                      pokemonType as keyof PokemonTypeColorMap
                    ),
                  }}
                >
                  {pokemonData?.trainingData?.baseFriendship}
                </p>
              </div>
              <div>
                <strong>Base Experience</strong>
                <p
                  style={{
                    color: getColorForPokemonType(
                      pokemonType as keyof PokemonTypeColorMap
                    ),
                  }}
                >
                  {pokemonData?.trainingData?.baseExperience}
                </p>
              </div>
              <div>
                <strong>Growth Rate</strong>
                <p
                  style={{
                    color: getColorForPokemonType(
                      pokemonType as keyof PokemonTypeColorMap
                    ),
                  }}
                >
                  {getNamePascalCase(
                    pokemonData?.trainingData?.growthRate!
                  )?.replace("-", " ")}
                </p>
              </div>
            </div>
          </div>
          <div className="pokemon__moves">
            <div className="moves__title">
              <h1
                style={{
                  backgroundColor: getColorForPokemonType(
                    pokemonType as keyof PokemonTypeColorMap
                  ),
                }}
              >
                {" "}
                MOVES
              </h1>
            </div>
            <table>
              <thead
                style={{
                  backgroundColor: getColorForPokemonType(
                    pokemonType as keyof PokemonTypeColorMap
                  ),
                }}
              >
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Power</th>
                  <th>Accuracy</th>
                  <th>PP</th>
                </tr>
              </thead>
              <tbody>
                {pokemonData?.movesData?.map((moveItem, moveIndex) => (
                  <tr key={moveIndex}>
                    <td>
                      {getNamePascalCase(moveItem.name).replace("-", " ")}
                    </td>
                    <td>
                      {getNamePascalCase(moveItem.category).replace("-", " ")}
                    </td>
                    <td>{getNamePascalCase(moveItem.type)}</td>
                    <td>{moveItem.power !== null ? moveItem.power : "-"}</td>
                    <td>
                      {moveItem.accuracy !== null
                        ? moveItem.accuracy + "%"
                        : "-"}
                    </td>
                    <td>{moveItem.pp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetailPage;
