import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { auth, navigateByLoginState } from "./context/FirebaseContext";
import {
  CONTACTS_ENDPOINT,
  HOME_ENDPOINT,
  LOGIN_ENDPOINT,
  LOGOUT_ENDPOINT,
  NOT_FOUND_ENDPOINT,
  PRODUCTS_ENDPOINT,
  PURCHASE_REQUESTS_ENDPOINT,
  QUOTATIONS_ENDPOINT,
  SUPPLIERS_ENDPOINT,
  USERS_ENDPOINT,
} from "./data/constants";
import { FirebaseUser, firebaseUserRepository } from "./models/FirebaseUserRepository";
import Contacts from "./pages/Contacts";
import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";
import Logout from "./pages/Logout";
import Navbar from "./pages/Navbar";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import PurchaseRequests from "./pages/PurchaseRequests";
import Quotations from "./pages/Quotations";
import Suppliers from "./pages/Suppliers";
import Users from "./pages/Users";

type DarkThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export const FirebaseUserContext = createContext<FirebaseUser | null>(null);
export const DarkThemeContext = createContext<DarkThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  function toggleDarkMode() {
    setIsDarkMode((prev) => !prev);
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => updateFirebaseUserContext(user));
  }, []);

  useEffect(() => {
    navigateByLoginState(navigate);
  }, [navigate]);

  useEffect(() => {
    adjustDarkMode();
  }, [isDarkMode]);

  async function updateFirebaseUserContext(user: User | null) {
    if (!user || !user.email) {
      setUser(null);
      return;
    }

    const firebaseUser = await firebaseUserRepository.getUniqueByField("email", user.email);

    setUser(firebaseUser);
  }

  function adjustDarkMode() {
    const htmlElement = document.querySelector("html");

    if (!htmlElement) {
      return;
    }

    htmlElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    htmlElement.setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
  }

  return (
    <FirebaseUserContext.Provider value={user}>
      <DarkThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
        <Container fluid className="p-0 m-0" style={{ height: "100vh" }}>
          {user?.isAdmin ? <AdminRoutes /> : <UserRoutes />}
        </Container>
      </DarkThemeContext.Provider>
    </FirebaseUserContext.Provider>
  );
}

function UserRoutes() {
  return (
    <Routes>
      <Route path={HOME_ENDPOINT} element={<Navbar />}>
        <Route index element={<Home />} />
        <Route path={LOGIN_ENDPOINT} element={<LoginRegister />} />
        <Route path={LOGOUT_ENDPOINT} element={<Logout />} />
        <Route path={NOT_FOUND_ENDPOINT} element={<NotFound />} />
        <Route path={PURCHASE_REQUESTS_ENDPOINT} element={<PurchaseRequests />} />
        <Route path={`${QUOTATIONS_ENDPOINT}/:id`} element={<Quotations />} />
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
        <Route path={LOGOUT_ENDPOINT} element={<Logout />} />
        <Route path={NOT_FOUND_ENDPOINT} element={<NotFound />} />
        <Route path={SUPPLIERS_ENDPOINT} element={<Suppliers />} />
        <Route path={CONTACTS_ENDPOINT} element={<Contacts />} />
        <Route path={PRODUCTS_ENDPOINT} element={<Products />} />
        <Route path={USERS_ENDPOINT} element={<Users />} />
        <Route path={PURCHASE_REQUESTS_ENDPOINT} element={<PurchaseRequests />} />
        <Route path={`${QUOTATIONS_ENDPOINT}/:id`} element={<Quotations />} />
      </Route>
    </Routes>
  );
}
