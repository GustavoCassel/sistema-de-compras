import { useEffect, useState } from "react";
import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { SUPPLIERS_ENDPOINT } from "../../data/constants";
import { Supplier, SUPPLIER_TYPES, SupplierType, SupplierRepository } from "../../models/SupplierRepository";

export default function EditSupplier() {
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [supplierType, setSupplierType] = useState<SupplierType>("Física");
  const [document, setDocument] = useState("");
  const [buttonVisible, setButtonVisible] = useState(true);

  const navigate = useNavigate();

  const id = useParams().id as string;

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

    const supplier = new Supplier();
    supplier.name = name;
    supplier.active = active;
    supplier.city = city;
    supplier.state = state;
    supplier.supplierType = supplierType;
    supplier.document = document;

    try {
      SupplierRepository.update(id, supplier);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Erro ao editar fornecedor.",
      });
      return;
    }

    setButtonVisible(false);

    Toast.fire({
      icon: "success",
      title: "Editado com sucesso!",
    });

    setTimeout(() => {
      navigate(SUPPLIERS_ENDPOINT);
    }, 1000);
  }

  async function loadSupplier() {
    try {
      const supplier = await SupplierRepository.findById(id);

      setName(supplier.name);
      setActive(supplier.active);
      setCity(supplier.city);
      setState(supplier.state);
      setSupplierType(supplier.supplierType);
      setDocument(supplier.document);

      Toast.fire({
        icon: "success",
        title: "Fornecedor carregado com sucesso.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Erro ao carregar fornecedor.",
      });

      setTimeout(() => {
        navigate(SUPPLIERS_ENDPOINT);
      }, 500);

      return;
    }
  }

  useEffect(() => {
    loadSupplier();
  }, []);

  return (
    <Container className="w-100 flex">
      <Row className="justify-content-md-center mt-5">
        <Col md="4" className="shadow p-3 mb-5 bg-body-tertiary rounded">
          <h2 className="text-center mb-3">Editar Fornecedor</h2>
          <FloatingLabel controlId="floatingInput" label="Nome" className="mb-3">
            <Form.Control type="text" value={name} placeholder="" onChange={(e) => setName(e.target.value)} />
          </FloatingLabel>

          <FloatingLabel controlId="floatingInput" label="Cidade" className="mb-3">
            <Form.Control type="text" value={city} placeholder="" onChange={(e) => setCity(e.target.value)} />
          </FloatingLabel>

          <FloatingLabel controlId="floatingInput" label="Estado" className="mb-3">
            <Form.Control type="text" value={state} placeholder="" onChange={(e) => setState(e.target.value.toUpperCase())} maxLength={2} required />
          </FloatingLabel>

          <FloatingLabel controlId="floatingInput" label={supplierType === "Física" ? "CPF" : "CNPJ"} className="mb-3">
            <Form.Control type="text" value={document} placeholder="" onChange={(e) => setDocument(e.target.value)} />
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

          {buttonVisible && (
            <Button variant="primary" type="submit" className="w-100" onClick={handleSubmit}>
              Salvar Alterações
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}