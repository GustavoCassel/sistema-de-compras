import "./Fornecedores.css";

import { listarFornecedores, apagarFornecedor } from "../../infra/fornecedores";

import ButtonCarregamento from "../../componentes/ButtonCarregamento";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

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
        <Link to={`/editarFornecedor/${row.id}`}>
          <Button variant="primary">Editar</Button>
        </Link>
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

  async function handleClickApagarFornecedor(row) {
    Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Sim, apagar!",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) {
        return;
      }

      try {
        await apagarFornecedor(row);
        setFornecedores(fornecedores.filter((f) => f.id !== row.id));

        Swal.fire({
          title: "Deletado!",
          text: "O fornecedor foi apagado com sucesso.",
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          title: "Erro!",
          text: "Ocorreu um erro ao apagar o fornecedor.",
          icon: "error",
        });
      }
    });
  }

  return (
    <div>
      <Link to="/cadastrarFornecedor">
        <Button variant="primary">Cadastrar Fornecedor</Button>
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
