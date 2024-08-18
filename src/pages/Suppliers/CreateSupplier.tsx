import { useState } from "react";
import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SUPPLIERS_ENDPOINT } from "../../data/constants";
import { Supplier, SUPPLIER_TYPES, SupplierRepository, SupplierType } from "../../models/SupplierRepository";

export default function CreateSupplier() {
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [supplierType, setSupplierType] = useState<SupplierType>("Física");
  const [document, setDocument] = useState("");
  const [cep, setCep] = useState("");
  const [buttonActive, setButtonActive] = useState(true);
  const [buttonText, setButtonText] = useState("Cadastrar");

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

  async function handleSubmit() {
    if (!name || !city || !state || !supplierType || !document) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    setButtonActive(false);
    setButtonText("Cadastrando...");

    try {
      const supplier = new Supplier();
      supplier.name = name;
      supplier.active = active;
      supplier.city = city;
      supplier.state = state;
      supplier.supplierType = supplierType;
      supplier.document = document;

      await SupplierRepository.create(supplier);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Erro ao cadastrar fornecedor.",
      });

      setButtonActive(true);
      setButtonText("Cadastrar");

      return;
    }

    setButtonText("Cadastrado!");

    Toast.fire({
      icon: "success",
      title: "Fornecedor cadastrado com sucesso!",
    });

    setTimeout(() => {
      navigate(SUPPLIERS_ENDPOINT);
    }, 1000);
  }

  return (
    <Container className="w-100 flex">
      <Row className="justify-content-md-center mt-5">
        <Col md="4" className="shadow p-3 mb-5 bg-body-tertiary rounded">
          <h2 className="text-center mb-3">Cadastrar Fornecedor</h2>
          <FloatingLabel controlId="floatingInput" label="Nome" className="mb-3">
            <Form.Control type="text" value={name} placeholder="" onChange={(e) => setName(e.target.value)} required />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInput" label="Cidade" className="mb-3">
            <Form.Control type="text" value={city} placeholder="" onChange={(e) => setCity(e.target.value)} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInput" label="Estado" className="mb-3">
            <Form.Control type="text" value={state} placeholder="" onChange={(e) => setState(e.target.value.toUpperCase())} maxLength={2} required />
          </FloatingLabel>

          <FloatingLabel controlId="floatingInput" label="CPF/CNPJ" className="mb-3">
            <Form.Control type="text" value={document} placeholder="" onChange={(e) => setDocument(e.target.value)} />
          </FloatingLabel>

          <FloatingLabel controlId="floatingInput" label="CEP" className="mb-3">
            <Form.Control type="text" value={cep} placeholder="" onChange={(e) => setCep(e.target.value)} minLength={8} maxLength={8} required />
          </FloatingLabel>

          <Form.Group controlId="tipoPessoa">
            <Form.Label>Tipo Pessoa</Form.Label>
            <Form.Control as="select" value={supplierType} onChange={(e) => setSupplierType(e.target.value as SupplierType)}>
              {SUPPLIER_TYPES.map((supplierType) => (
                <option key={supplierType} value={supplierType} label={supplierType}>
                  {supplierType}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="ativo" className="mb-3">
            <Form.Check type="checkbox" label="Ativo" checked={active} onChange={(e) => setActive(e.target.checked)} />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" onClick={handleSubmit} disabled={!buttonActive}>
            {buttonText}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
