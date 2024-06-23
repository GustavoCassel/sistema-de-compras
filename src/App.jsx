import "./App.css";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Fornecedores from "./pages/Fornecedores";
import CadastrarFornecedor from "./pages/CadastrarFornecedor";
import Contatos from "./pages/Contatos";
import Produtos from "./pages/Produtos";
import Cotacoes from "./pages/Cotacoes";
import NaoEncontrado from "./pages/NaoEncontrado";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="fornecedores" element={<Fornecedores />} />
          <Route path="contatos" element={<Contatos />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="cotacoes" element={<Cotacoes />} />
          <Route path="cadastrarFornecedor" element={<CadastrarFornecedor />} />
          <Route path="*" element={<NaoEncontrado />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
