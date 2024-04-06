import { lazy, useEffect } from "react";

import "./App.css";

const MainRoutes = lazy(() => {
  return import("@/pages");
});
function App() {
  useEffect(() => {
    const loader = document.getElementById("globalLoader");
    if (loader) loader.remove();
  }, []);

  return (
    <div>
      <MainRoutes />
    </div>
  );
}

export default App;
