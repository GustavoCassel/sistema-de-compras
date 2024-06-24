import React, { useEffect, useState } from "react";
import { listarFornecedores } from "../../infra/fornecedores";
import Form from "react-bootstrap/Form";

export default function Contatos() {
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState("");
  const [contatos, setContatos] = useState([]);

  useEffect(() => {
    listarFornecedores().then((fornecedores) => {
      setFornecedores(fornecedores);
    });
  }, []);

  useEffect(() => {
    if (fornecedorSelecionado) {
      console.log(fornecedorSelecionado);
    }
  }, [fornecedorSelecionado]);

  return (
    <div>
      <h2 className="text-center mt-5">Contatos</h2>
      <Form.Select
        aria-label="Default select example"
        onChange={(e) => setFornecedorSelecionado(e.target.value)}
      >
        <option>Selecione um fornecedor</option>
        {fornecedores.map((fornecedor) => (
          <option key={fornecedor.id} value={fornecedor}>
            {fornecedor.nome}
          </option>
        ))}
      </Form.Select>
    </div>
  );
}
