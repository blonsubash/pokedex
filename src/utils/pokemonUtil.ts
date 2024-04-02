import {
  NormalIcon,
  FireIcon,
  FightingIcon,
  FlyingIcon,
  GrassIcon,
  PoisonIcon,
  ElectricIcon,
  GroundIcon,
  PsychicIcon,
  RockIcon,
  IceIcon,
  BugIcon,
  DragonIcon,
  GhostIcon,
  DarkIcon,
  SteelIcon,
  FairyIcon,
  WaterIcon,
} from "@/assets/images/pokemonType";

// Define a function to get the image components for given Pokémon types
export function getPokemonTypeImages(type: string): JSX.Element[] {
  // Map Pokémon types to their corresponding image components
  const typeImageComponents = {
    normal: NormalIcon,
    fighting: FightingIcon,
    flying: FlyingIcon,
    poison: PoisonIcon,
    ground: GroundIcon,
    rock: RockIcon,
    bug: BugIcon,
    ghost: GhostIcon,
    steel: SteelIcon,
    fire: FireIcon,
    water: WaterIcon,
    grass: GrassIcon,
    electric: ElectricIcon,
    psychic: PsychicIcon,
    ice: IceIcon,
    dragon: DragonIcon,
    dark: DarkIcon,
    fairy: FairyIcon,
  };

  // Initialize an array to store image components
  const typeImageComponentsArray: JSX.Element[] = [];

  // Loop through each type in the types array

  // const typeName = pokemonType.toLowerCase();
  if (typeImageComponents[type]) {
    typeImageComponentsArray.push(typeImageComponents[type]);
  } else {
    // If no image component found for the type, push a default image component or handle it as per your requirement
    typeImageComponentsArray.push(NormalIcon); // You can define a default icon if needed
  }

  return typeImageComponentsArray;
}
