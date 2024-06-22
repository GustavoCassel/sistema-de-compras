import "./App.css";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Fornecedores from "./pages/Fornecedores";
import Contatos from "./pages/Contatos";
import Produtos from "./pages/Produtos";
import Cotacoes from "./pages/Cotacoes";
import NaoEncontrado from "./pages/NaoEncontrado";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./componentes/Login";
import CriarConta from "./componentes/CriarConta";
import LoadingButton from "./componentes/ButtonCarregamento";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return <Login />;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="fornecedores" element={<Fornecedores />} />
          <Route path="contatos" element={<Contatos />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="cotacoes" element={<Cotacoes />} />
          <Route path="*" element={<NaoEncontrado />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
