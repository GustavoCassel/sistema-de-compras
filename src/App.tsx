import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { navigateByLoginState } from "./context/FirebaseContext";
import { CREATE_SUPPLIER_ENDPOINT, EDIT_SUPPLIER_ENDPOINT, HOME_ENDPOINT, LOGIN_ENDPOINT, NOT_FOUND_ENDPOINT, SUPPLIERS_ENDPOINT } from "./data/constants";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./pages/Navbar";
import NotFound from "./pages/NotFound";
import Suppliers from "./pages/Suppliers";
import CreateSupplier from "./pages/Suppliers/CreateSupplier";
import EditSupplier from "./pages/Suppliers/EditSupplier";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigateByLoginState(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path={HOME_ENDPOINT} element={<Navbar />}>
        <Route index element={<Home />} />
        <Route path={LOGIN_ENDPOINT} element={<Login />} />
        <Route path={NOT_FOUND_ENDPOINT} element={<NotFound />} />
        <Route path={SUPPLIERS_ENDPOINT} element={<Suppliers />} />
        <Route path={CREATE_SUPPLIER_ENDPOINT} element={<CreateSupplier />} />
        <Route path={`${EDIT_SUPPLIER_ENDPOINT}/:id`} element={<EditSupplier />} />
      </Route>
    </Routes>
  );
}

export default App;
