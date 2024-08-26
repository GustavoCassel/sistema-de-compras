import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { auth, navigateByLoginState } from "./context/FirebaseContext";
import { CONTACTS_ENDPOINT, HOME_ENDPOINT, LOGIN_ENDPOINT, NOT_FOUND_ENDPOINT, PRODUCTS_ENDPOINT, SUPPLIERS_ENDPOINT } from "./data/constants";
import Contacts from "./pages/Contacts";
import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";
import Navbar from "./pages/Navbar";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";

export const FirebaseUserContext = createContext<User | null>(null);

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => setUser(user));
  }, []);

  useEffect(() => {
    navigateByLoginState(navigate);
  }, [navigate]);

  return (
    <FirebaseUserContext.Provider value={user}>
      <Routes>
        <Route path={HOME_ENDPOINT} element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path={LOGIN_ENDPOINT} element={<LoginRegister />} />
          <Route path={NOT_FOUND_ENDPOINT} element={<NotFound />} />
          <Route path={SUPPLIERS_ENDPOINT} element={<Suppliers />} />
          <Route path={CONTACTS_ENDPOINT} element={<Contacts />} />
          <Route path={PRODUCTS_ENDPOINT} element={<Products />} />
        </Route>
      </Routes>
    </FirebaseUserContext.Provider>
  );
}

export default App;
