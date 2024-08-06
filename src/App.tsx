import "bootstrap/dist/css/bootstrap.min.css";
import { createContext, useState } from "react";
import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import "./App.css";

import { HOME_ENDPOINT, LOGIN_ENDPOINT } from "./model/constants";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Home from "./pages/Home";

type Theme = "light" | "dark";

export const ThemeProvider = createContext({
  theme: "light",
  setTheme: (theme: Theme) => {},
});

function App() {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <ThemeProvider.Provider value={{ theme, setTheme }}>
      <Router>
        <Routes>
          <Route path={HOME_ENDPOINT} element={<Layout />}>
            <Route index element={<Home />} />
            <Route path={LOGIN_ENDPOINT} element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider.Provider>
  );
}

export default App;
