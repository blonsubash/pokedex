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
