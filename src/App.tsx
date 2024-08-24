import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { navigateByLoginState } from "./context/FirebaseContext";
import { CONTACTS_ENDPOINT, HOME_ENDPOINT, LOGIN_ENDPOINT, NOT_FOUND_ENDPOINT, SUPPLIERS_ENDPOINT } from "./data/constants";
import Contacts from "./pages/Contacts";
import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";
import Navbar from "./pages/Navbar";
import NotFound from "./pages/NotFound";
import Suppliers from "./pages/Suppliers";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigateByLoginState(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path={HOME_ENDPOINT} element={<Navbar />}>
        <Route index element={<Home />} />
        <Route path={LOGIN_ENDPOINT} element={<LoginRegister />} />
        <Route path={NOT_FOUND_ENDPOINT} element={<NotFound />} />
        <Route path={SUPPLIERS_ENDPOINT} element={<Suppliers />} />
        <Route path={CONTACTS_ENDPOINT} element={<Contacts />} />
      </Route>
    </Routes>
  );
}

export default App;
