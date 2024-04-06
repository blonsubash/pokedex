import { FC, Suspense, lazy } from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";

const PokemonListPage = lazy(() => {
  return import("@/pages/pokemonList");
});
const PokemonDetailPage = lazy(() => {
  return import("@/pages/pokemonDetail");
});

const AppRoutes: FC = () => {
  return (
    <Suspense fallback={"Loading"}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PokemonListPage />} />
          <Route path="/pokemon/:pokemonId" element={<PokemonDetailPage />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default AppRoutes;
