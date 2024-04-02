import { lazy, useEffect, useState } from "react";

const PokemonListsPage = lazy(() => {
  return import("@/pokemonList");
});
function App() {
  useEffect(() => {
    const loader = document.getElementById("globalLoader");
    if (loader) loader.remove();
  }, []);

  return (
    <div>
      <PokemonListsPage />
    </div>
  );
}

export default App;
