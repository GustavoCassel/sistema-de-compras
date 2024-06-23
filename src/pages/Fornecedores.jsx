import "./Fornecedores.css";

import {
  listarFornecedores,
  inserirFornecedor,
  atualizarFornecedor,
  apagarFornecedor,
} from "../infra/fornecedores";

import CadastrarFornecedor from "./CadastrarFornecedor";

import ButtonCarregamento from "../componentes/ButtonCarregamento";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    listarFornecedores().then((fornecedores) => {
      setFornecedores(fornecedores);
      setPending(false);
    });
  }, []);

  const columns = [
    {
      name: "Nome",
      selector: (row) => row.nome,
      sortable: true,
    },
    {
      name: "Tipo Pessoa",
      selector: (row) => row.tipoPessoa,
      sortable: true,
    },
    {
      name: "Bairro",
      selector: (row) => row.bairro,
      sortable: true,
    },
    {
      name: "Cidade",
      selector: (row) => row.cidade,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
    },
    {
      name: "Editar",
      cell: (row) => (
        <ButtonCarregamento variant="secondary" loadingMessage="Carregando...">
          Editar
        </ButtonCarregamento>
      ),
    },
    {
      name: "Apagar",
      compact: true,
      cell: (row) => (
        <ButtonCarregamento
          variant="danger"
          loadingMessage="Apagando..."
          onClick={async () => {
            await handleClickApagarFornecedor(row);
          }}
        >
          Apagar
        </ButtonCarregamento>
      ),
    },
  ];

  async function handleClickCadastrarFornecedor() {}

  async function handleClickEditarFornecedor(row) {}

  async function handleClickApagarFornecedor(row) {
    await apagarFornecedor(row);
    setFornecedores(fornecedores.filter((f) => f.id !== row.id));
    console.log("Apagando fornecedor", row);
  }

  return (
    <div>
      <Link to="/cadastrarFornecedor">
        <Button variant="primary" onClick={handleClickCadastrarFornecedor}>
          Cadastrar Fornecedor
        </Button>
      </Link>
      <DataTable
        title="Fornecedores"
        columns={columns}
        data={fornecedores}
        progressPending={pending}
        striped
        pagination
        paginationPerPage={10}
        highlightOnHover
        dense
      />
    </div>
  );
}
