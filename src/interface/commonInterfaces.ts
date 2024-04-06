export interface PokemonList {
  name: string;
  url: string;
  image?: string;
  types: PokemonTypes[];
  habitat: string;
  region: string;
}

export interface PokemonTypes {
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonDetail {
  name: string;
  height: number;
  weight: number;
  abilities: AbilitiesDetail[];
  types: PokemonTypes[];
  forms: FormsDetail[];
  sprites: PokemonImage;
  stats: PokemonStats[];
  speciesData: {
    genus: string;
  };
  evolutionData: EvolutionData[];
  breedingData: BreedingData;
  trainingData: TrainingData;
  movesData: MovesData[];
}

export interface AbilitiesDetail {
  ability: { name: string; url: string };
  is_hidden: boolean;
}

export interface FormsDetail {
  name: string;
  url: string;
}

export interface PokemonImage {
  front_default: string;
  other: { dream_world: { front_default: string } };
}

export interface PokemonStats {
  base_stat: number;
  stat: { name: string; url: string };
}

export interface EvolutionData {
  evolvesFrom: string;
  evolvesTo: string;
  evolvesToImage: string;
  minLevel: number;
}

export interface BreedingData {
  eggCycles: number;
  eggGroups: [string];
  genderDistribution: { male: string; female: string };
}

export interface TrainingData {
  baseExperience: number;
  baseFriendship: number;
  catchRate: number;
  growthRate: string;
}

export interface MovesData {
  name: string;
  type: string;
  accuracy: number;
  category: string;
  power: number;
  pp: number;
}
export type PokemonTypeColorMap = {
  normal: string;
  fighting: string;
  flying: string;
  poison: string;
  ground: string;
  rock: string;
  bug: string;
  ghost: string;
  steel: string;
  fire: string;
  water: string;
  grass: string;
  electric: string;
  psychic: string;
  ice: string;
  dragon: string;
  dark: string;
  fairy: string;
};
