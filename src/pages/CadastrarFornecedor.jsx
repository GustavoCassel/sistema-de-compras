import React, { useState } from "react";
import ButtonCarregamento from "../componentes/ButtonCarregamento";
import { useNavigate } from "react-router-dom";
import { inserirFornecedor } from "../infra/fornecedores";
import {
  Alert,
  Form,
  Container,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";

export default function CadastrarFornecedor() {
  const [nome, setNome] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState("Física");

  const navigate = useNavigate();

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit() {
    const fornecedor = {
      nome,
      ativo,
      bairro,
      cidade,
      estado,
      tipoPessoa,
    };

    setErro("");
    setSucesso("");

    if (!nome || !bairro || !cidade || !estado || !tipoPessoa) {
      setErro("Preencha todos os campos.");
      return;
    }

    const retorno = await inserirFornecedor(fornecedor);

    if (retorno.erro) {
      setErro(retorno.erro);
      return;
    }

    setSucesso("Fornecedor cadastrado com sucesso.\nRedirecionando...");

    setTimeout(() => {
      navigate("/fornecedores");
    }, 500);
  }

  return (
    <Container className="w-100 flex">
      <Row className="justify-content-md-center mt-5">
        <Col md="4" className="shadow p-3 mb-5 bg-body-tertiary rounded">
          <h2 className="text-center mb-3">Cadastrar Fornecedor</h2>
          <FloatingLabel
            controlId="floatingInput"
            label="Nome"
            className="mb-3"
          >
            <Form.Control
              type="text"
              value={nome}
              placeholder=""
              onChange={(e) => setNome(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Cidade"
            className="mb-3"
          >
            <Form.Control
              type="text"
              value={cidade}
              placeholder=""
              onChange={(e) => setCidade(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Bairro"
            className="mb-3"
          >
            <Form.Control
              type="text"
              value={bairro}
              placeholder=""
              onChange={(e) => setBairro(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Estado"
            className="mb-3"
          >
            <Form.Control
              type="text"
              value={estado}
              placeholder=""
              onChange={(e) => setEstado(e.target.value)}
              maxLength={2}
              required
              onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
            />
          </FloatingLabel>

          <Form.Group controlId="tipoPessoa">
            <Form.Label>Tipo Pessoa</Form.Label>
            <Form.Control
              as="select"
              value={tipoPessoa}
              onChange={(e) => setTipoPessoa(e.target.value)}
            >
              <option value="Física">Física</option>
              <option value="Jurídica">Jurídica</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="ativo" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Ativo"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
            />
          </Form.Group>

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
              loadingMessage="Cadastrando..."
            >
              Cadastrar
            </ButtonCarregamento>
          )}
        </Col>
      </Row>
    </Container>
  );
}
