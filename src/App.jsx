import { lazy, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const PokemonListsPage = lazy(() => {
  return import("@/pokemonList");
});
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <PokemonListsPage />
    </div>
  );
}

export default App;
