/*
id (string) - ID do contato (gerado automaticamente)
nome (string) - Nome do contato
email (string) - E-mail do contato
telefone (string) - Telefone do contato
fornecedor (string) - ID do fornecedor associado ao contato
ativo (boolean) - Indica se o contato está ativo ou não (padrão: true)
*/

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Alert,
  Form,
  Container,
  Row,
  Col,
  Button,
  FloatingLabel,
} from "react-bootstrap";
import { inserirContato } from "../../infra/contatos";
import { buscarFornecedor } from "../../infra/fornecedores";

export default function CadastrarContato() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [botaoVisivel, setBotaoVisivel] = useState(true);

  const { idFornecedor } = useParams();

  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  useEffect(() => {
    buscarFornecedor(idFornecedor).then((fornecedor) => {
      setFornecedor(fornecedor.nome);
    });
  }, []);

  async function handleSubmit() {
    const contato = {
      nome,
      email,
      telefone,
      fornecedor: idFornecedor,
      ativo,
    };

    if (!nome || !email || !telefone || !fornecedor) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    const retorno = await inserirContato(contato);

    if (retorno?.erro) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: retorno?.erro,
      });
      return;
    }

    setBotaoVisivel(false);

    Toast.fire({
      icon: "success",
      title: "Contato cadastrado com sucesso!",
    });

    setTimeout(() => {
      navigate("/contatos");
    }, 1000);
  }

  return (
    <Container className="w-100 flex">
      <Row className="justify-content-md-center mt-5">
        <Col md="4" className="shadow p-3 mb-5 bg-body-tertiary rounded">
          <h2 className="text-center mb-3">Cadastrar Contato</h2>
          <Form>
            <FloatingLabel controlId="nome" label="Nome">
              <Form.Control
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mb-3"
              />
            </FloatingLabel>
            <FloatingLabel controlId="email" label="E-mail">
              <Form.Control
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-3"
              />
            </FloatingLabel>
            <FloatingLabel controlId="telefone" label="Telefone">
              <Form.Control
                type="text"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="mb-3"
              />
            </FloatingLabel>
            <FloatingLabel controlId="fornecedor" label="Fornecedor">
              <Form.Control
                type="text"
                placeholder="Fornecedor"
                value={fornecedor}
                onChange={(e) => setFornecedor(e.target.value)}
                className="mb-3"
                readOnly
              />
            </FloatingLabel>
            <Form.Group controlId="ativo" className="mt-3">
              <Form.Check
                type="checkbox"
                label="Ativo"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
                className="mb-3"
              />
            </Form.Group>
            {botaoVisivel && (
              <Button
                variant="primary"
                className="w-100"
                onClick={handleSubmit}
              >
                Cadastrar
              </Button>
            )}
            <Link to="/contatos">
              <Button variant="secondary" className="mt-3 w-100">
                Voltar
              </Button>
            </Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
