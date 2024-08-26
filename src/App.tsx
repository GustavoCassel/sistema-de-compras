import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { auth, navigateByLoginState } from "./context/FirebaseContext";
import {
  CONTACTS_ENDPOINT,
  HOME_ENDPOINT,
  LOGIN_ENDPOINT,
  NOT_FOUND_ENDPOINT,
  PRODUCTS_ENDPOINT,
  PURCHASE_REQUESTS_ENDPOINT,
  SUPPLIERS_ENDPOINT,
  USERS_ENDPOINT,
} from "./data/constants";
import { FirebaseUser, firebaseUserRepository } from "./models/FirebaseUserRepository";
import Contacts from "./pages/Contacts";
import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";
import Navbar from "./pages/Navbar";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import Users from "./pages/Users";

export const FirebaseUserContext = createContext<FirebaseUser | null>(null);

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => updateFirebaseUserContext(user));
  }, []);

  async function updateFirebaseUserContext(user: User | null) {
    if (!user) {
      setUser(null);
      return;
    }

    const firebaseUser = await firebaseUserRepository.getUniqueByField("email", user.email);

    setUser(firebaseUser);
  }

  useEffect(() => {
    navigateByLoginState(navigate);
  }, [navigate]);

  return <FirebaseUserContext.Provider value={user}>{user?.isAdmin ? <AdminRoutes /> : <UserRoutes />}</FirebaseUserContext.Provider>;
}

function UserRoutes() {
  return (
    <Routes>
      <Route path={HOME_ENDPOINT} element={<Navbar />}>
        <Route index element={<Home />} />
        <Route path={LOGIN_ENDPOINT} element={<LoginRegister />} />
        <Route path={NOT_FOUND_ENDPOINT} element={<NotFound />} />
        <Route path={PURCHASE_REQUESTS_ENDPOINT} element={<h1>compras</h1>} />
      </Route>
    </Routes>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path={HOME_ENDPOINT} element={<Navbar />}>
        <Route index element={<Home />} />
        <Route path={LOGIN_ENDPOINT} element={<LoginRegister />} />
        <Route path={NOT_FOUND_ENDPOINT} element={<NotFound />} />
        <Route path={SUPPLIERS_ENDPOINT} element={<Suppliers />} />
        <Route path={CONTACTS_ENDPOINT} element={<Contacts />} />
        <Route path={PRODUCTS_ENDPOINT} element={<Products />} />
        <Route path={USERS_ENDPOINT} element={<Users />} />
      </Route>
    </Routes>
  );
}
