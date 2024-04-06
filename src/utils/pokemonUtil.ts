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
import { PokemonTypeColors } from "@/constants/appConfig";
import { PokemonTypeColorMap } from "@/interface";

export function getPokemonTypeImages(type: string | undefined) {
  const typeImageComponents: any = {
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

  if (!type) {
    return NormalIcon;
  }

  return typeImageComponents[type] || NormalIcon;
}

export const getColorForPokemonType = (
  type: keyof PokemonTypeColorMap
): string => {
  return PokemonTypeColors[type] || "#333333";
};
