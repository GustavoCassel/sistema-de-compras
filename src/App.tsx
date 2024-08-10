import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import { HOME_ENDPOINT, LOGIN_ENDPOINT, NOT_FOUND_ENDPOINT } from "./constants";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function PrivateRoute({ component: Component }: any) {
  const isLogged = true;

  return isLogged ? <Component /> : <Navigate to={LOGIN_ENDPOINT} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME_ENDPOINT} element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={LOGIN_ENDPOINT} element={<Login />} />
          <Route path={NOT_FOUND_ENDPOINT} element={<NotFound />} />
          <Route
            path="/teste"
            element={
              <PrivateRoute>
                <h1>Teste</h1>
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
