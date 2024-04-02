export interface PokemonList {
  name: string;
  url: string;
  image?: string;
  types: PokemonTypes[];
}

export interface PokemonTypes {
  type: {
    name: string;
    url: string;
  };
}
