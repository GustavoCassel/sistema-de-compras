import React, { useEffect, useState } from "react";
import { listarFornecedores } from "../../infra/fornecedores";
import { listarContatos } from "../../infra/contatos";
import Form from "react-bootstrap/Form";
import DataTable from "react-data-table-component";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Contatos() {
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedorIdSelecionado, setFornecedorIdSelecionado] = useState("");
  const [contatos, setContatos] = useState([]);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    setPending(true);
    listarFornecedores().then((fornecedores) => {
      setFornecedores(fornecedores);
    });
    setPending(false);
  }, []);

  useEffect(() => {
    const buscarContatos = async () => {
      if (fornecedorIdSelecionado) {
        const contatos = await listarContatos(fornecedorIdSelecionado);

        const contatosDesseFornecedor = contatos.filter(
          (contato) => contato.fornecedor === fornecedorIdSelecionado
        );

        if (contatosDesseFornecedor) {
          setContatos(contatosDesseFornecedor);
        }
      }
    };

    setPending(true);
    buscarContatos();
    setPending(false);
  }, [fornecedorIdSelecionado]);

  const columns = [
    {
      name: "Nome",
      selector: (row) => row.nome,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Telefone",
      selector: (row) => row.telefone,
      sortable: true,
    },
    {
      name: "Editar",
      cell: (row) => (
        <Link to={`/editarContato/${row?.fornecedor}`}>
          <Button variant="primary">Editar</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="d-flex flex-column align-items-center">
      <h2 className="text-center mt-5">Contatos</h2>
      <p>
        A quem for corrigir: Existem contatos cadastrados no fornecedor
        "Armênio"
      </p>
      <Form.Select
        aria-label="Default select example"
        aria-placeholder="Selecione um fornecedor"
        onChange={(e) => {
          setFornecedorIdSelecionado(e.target.value);
        }}
      >
        <option></option>
        {fornecedores.map((fornecedor) => (
          <option key={fornecedor.id} value={fornecedor.id}>
            {fornecedor.nome}
          </option>
        ))}
      </Form.Select>
      {fornecedorIdSelecionado && (
        <Link to={`/cadastrarContato/${fornecedorIdSelecionado}`}>
          <Button variant="primary" className="mt-3">
            Cadastrar Contato
          </Button>
        </Link>
      )}

      <DataTable
        title="Contatos Viculados ao Fornecedor"
        columns={columns}
        data={contatos}
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
