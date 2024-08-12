import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { CREATE_SUPPLIER_ENDPOINT, EDIT_SUPPLIER_ENDPOINT, HOME_ENDPOINT, LOGIN_ENDPOINT, NOT_FOUND_ENDPOINT, SUPPLIERS_ENDPOINT } from "./constants";
import AppHeader from "./pages/AppHeader";
import CreateSupplier from "./pages/CreateSupplier";
import EditSupplier from "./pages/EditSupplier";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Suppliers from "./pages/Suppliers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME_ENDPOINT} element={<AppHeader />}>
          <Route index element={<Home />} />
          <Route path={LOGIN_ENDPOINT} element={<Login />} />
          <Route path={NOT_FOUND_ENDPOINT} element={<NotFound />} />
          <Route path={SUPPLIERS_ENDPOINT} element={<Suppliers />} />
          <Route path={CREATE_SUPPLIER_ENDPOINT} element={<CreateSupplier />} />
          <Route path={`${EDIT_SUPPLIER_ENDPOINT}/:id`} element={<EditSupplier />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
