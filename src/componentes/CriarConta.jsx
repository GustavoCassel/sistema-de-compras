import React, { useState } from "react";
import {
  Alert,
  Form,
  Container,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";

import ButtonCarregamento from "./ButtonCarregamento";
import { criarConta } from "../infra/usuarios";

export default function CriarConta() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit() {
    setErro("");
    setSucesso("");

    if (!email || !senha || !confirmaSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmaSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    const retorno = await criarConta(email, senha);

    if (retorno.erro) {
      setErro(retorno.erro);
      return;
    }

    setSucesso("Cadastro realizado com sucesso.\nRedirecionando...");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="4">
          <h2 className="text-center mb-3">Criar Conta</h2>

          <FloatingLabel
            controlId="floatingInput"
            label="Digite seu email"
            className="mb-3"
          >
            <Form.Control
              type="email"
              value={email}
              placeholder=""
              onChange={(e) => setEmail(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingPassword"
            label="Digite sua senha"
            className="mb-3"
          >
            <Form.Control
              type="password"
              value={senha}
              placeholder=""
              onChange={(e) => setSenha(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingPassword"
            label="Confirme sua senha"
            className="mb-3"
          >
            <Form.Control
              type="password"
              value={confirmaSenha}
              placeholder=""
              onChange={(e) => setConfirmaSenha(e.target.value)}
            />
          </FloatingLabel>

          {erro && (
            <Alert variant="danger" className="mb-3">
              {erro}
            </Alert>
          )}

          {sucesso && (
            <Alert variant="success" className="mb-3">
              {sucesso}
            </Alert>
          )}

          {!sucesso && (
            <ButtonCarregamento
              variant="primary"
              type="submit"
              className="w-100"
              onClick={handleSubmit}
              loadingMessage="Criando conta..."
            >
              Criar Conta
            </ButtonCarregamento>
          )}
        </Col>
      </Row>
    </Container>
  );
}
