import "./App.css";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Contatos from "./pages/Contatos/Contatos";
import Produtos from "./pages/Produtos";
import Cotacoes from "./pages/Cotacoes";
import NaoEncontrado from "./pages/NaoEncontrado";

import Fornecedores from "./pages/Fornecedores/Fornecedores";
import CadastrarFornecedor from "./pages/Fornecedores/CadastrarFornecedor";
import EditarFornecedor from "./pages/Fornecedores/EditarFornecedor";

import CadastrarContato from "./pages/Contatos/CadastrarContato";

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
          <Route
            path="cadastrarContato/:idFornecedor"
            element={<CadastrarContato />}
          />
          <Route path="produtos" element={<Produtos />} />
          <Route path="cotacoes" element={<Cotacoes />} />
          <Route path="cadastrarFornecedor" element={<CadastrarFornecedor />} />
          <Route path="editarFornecedor/:id" element={<EditarFornecedor />} />
          <Route path="*" element={<NaoEncontrado />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
