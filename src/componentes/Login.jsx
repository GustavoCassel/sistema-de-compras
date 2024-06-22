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
import { logarUsuario } from "../infra/usuarios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit() {
    setErro("");
    setSucesso("");

    if (!email || !password) {
      setErro("Preencha todos os campos.");
      return;
    }

    const retorno = await logarUsuario(email, password);

    if (retorno.erro) {
      setErro(retorno.erro);
      return;
    }

    setSucesso("Login realizado com sucesso.\nRedirecionando...");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="4">
          <h2 className="text-center mb-3">Login</h2>

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
              value={password}
              placeholder=""
              onChange={(e) => setPassword(e.target.value)}
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
              loadingMessage="Entrando..."
            >
              Login
            </ButtonCarregamento>
          )}
        </Col>
      </Row>
    </Container>
  );
}
