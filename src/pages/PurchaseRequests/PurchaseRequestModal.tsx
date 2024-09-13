import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useEffect, useState } from "react";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { CrudOperation } from "../../data/constants";
import { PurchaseRequest, purchaseRequestRepository } from "../../models/PurchaseRequestRepository";
import { Toast } from "../../utils/Alerts";
import { Product, productRepository } from "../../models/ProductRepository";
import { Supplier, supplierRepository } from "../../models/SupplierRepository";

type PurchaseRequestModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  crudOperation: CrudOperation;
  purchaseRequest?: PurchaseRequest;
  updateTable: () => void;
};

const schema = z.object({
  requestDate: z
    .string()
    .min(1, "Data da Solicitação é obrigatória")
    .refine((value) => moment(value).isValid(), { message: "Data inválida" }),
  requesterId: z.string().min(1, "Solicitante é obrigatório"),
  productId: z.string().min(1, "Produto é obrigatório"),
  quantity: z.number().min(1, "Quantidade é obrigatória"),
  quotationIds: z.array(z.string()),
  status: z.string().min(1, "Status é obrigatório"),
  approvalDate: z.string().optional(),
  observations: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function PurchaseRequestModal({ visible, setVisible, crudOperation, purchaseRequest, updateTable }: PurchaseRequestModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: new PurchaseRequest(),
  });

  const [buttonText, setButtonText] = useState("");
  const [buttonVisible, setButtonVisible] = useState(false);
  const [submittingButtonText, setSubmittingButtonText] = useState("");
  const [headerIcon, setHeaderIcon] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [formColor, setFormColor] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  async function loadProducts() {
    console.log("loading products");
    setLoadingProducts(true);
    try {
      const products = await productRepository.getAll();
      console.log("products", products);
      setProducts(products);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function loadSuppliers() {
    setLoadingSuppliers(true);
    try {
      const suppliers = await supplierRepository.getAll();

      setSuppliers(suppliers);
    } finally {
      setLoadingSuppliers(false);
    }
  }

  useEffect(() => {
    if (!visible) {
      return;
    }
    setFieldsIntoModal();

    updateFormByCrudOperation();

    if (crudOperation === CrudOperation.Create) {
      loadProducts();
      loadSuppliers();
    }
  }, [crudOperation, purchaseRequest, visible]);

  function updateFormByCrudOperation() {
    setFormDisabled(false);
    setButtonVisible(true);
    if (crudOperation === CrudOperation.Create) {
      setSubmittingButtonText("Cadastrando...");
      setButtonText("Cadastrar");
      setHeaderText("Cadastrar Solicitação de Compra");
      setHeaderIcon("bi bi-plus-square");
      setFormColor("primary");
    } else if (crudOperation === CrudOperation.Update) {
      setSubmittingButtonText("Atualizando...");
      setButtonText("Atualizar");
      setHeaderText("Atualizar Produto");
      setHeaderIcon("bi bi-pencil-square");
      setFormColor("warning");
    } else if (crudOperation === CrudOperation.Delete) {
      setSubmittingButtonText("Excluindo...");
      setFormDisabled(true);
      setButtonText("Confirma exclusão?");
      setHeaderText("Excluir Produto");
      setHeaderIcon("bi bi-trash");
      setFormColor("danger");
    } else if (crudOperation === CrudOperation.Read) {
      setFormDisabled(true);
      setButtonVisible(false);
      setHeaderText("Detalhes do Produto");
      setHeaderIcon("bi bi-info-square");
      setFormColor("info");
    } else {
      throw new Error("Operação não permitida");
    }
  }

  function handleClose() {
    setVisible(false);
  }

  function setFieldsIntoModal() {
    reset(purchaseRequest || new PurchaseRequest(), { keepValues: false });

    if (crudOperation === CrudOperation.Create) {
      return;
    }

    trigger();
  }

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const parsed = schema.parse(formData) as PurchaseRequest;

    console.log("pego do form", parsed.requestDate);

    try {
      if (crudOperation === CrudOperation.Delete) {
        await purchaseRequestRepository.delete(purchaseRequest!.id);
      } else if (crudOperation === CrudOperation.Create) {
        await purchaseRequestRepository.create(parsed);
      } else if (crudOperation === CrudOperation.Update) {
        await purchaseRequestRepository.update(purchaseRequest!.id, parsed);
      } else {
        throw new Error("Operação não permitida");
      }
    } catch (error) {
      const err = error as Error;

      Swal.fire({
        icon: "error",
        title: crudOperation === CrudOperation.Delete ? "Erro ao excluir" : "Erro ao salvar",
        html: err.message,
      });

      return;
    }

    Toast.fire({
      icon: "success",
      title: crudOperation === CrudOperation.Delete ? "Excluído com sucesso!" : "Salvo com sucesso!",
    });

    updateTable();

    handleClose();
  };

  return (
    <Modal show={visible} onHide={handleClose} scrollable>
      <Modal.Header closeButton className={`bg-${formColor} text-white`}>
        <Modal.Title>
          <i className={`${headerIcon} me-2`} />
          {headerText}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <fieldset disabled={formDisabled}>
            <Container>
              <Form.Group className="mb-3" controlId="requestDate">
                <FloatingLabel controlId="requestDate" label="Data da Solicitação">
                  <Form.Control type="date" {...register("requestDate")} isInvalid={!!errors.requestDate} disabled />
                  <Form.Control.Feedback type="invalid">{errors.requestDate?.message}</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3" controlId="requesterId">
                <FloatingLabel controlId="requesterId" label="Solicitante">
                  <Form.Control as="select" {...register("requesterId")} isInvalid={!!errors.requesterId}>
                    <option value="">Selecione um solicitante</option>
                    <option value="1">Solicitante 1</option>
                    <option value="2">Solicitante 2</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.requesterId?.message}</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3" controlId="productId">
                <FloatingLabel controlId="productId" label="Produto">
                  {loadingProducts && <p>Carregando produtos...</p>}
                  <Form.Control as="select" {...register("productId")} isInvalid={!!errors.productId}>
                    <option value="">Selecione um produto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.productId?.message}</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3" controlId="quantity">
                <FloatingLabel controlId="quantity" label="Quantidade">
                  <Form.Control type="number" {...register("quantity")} isInvalid={!!errors.quantity} />
                  <Form.Control.Feedback type="invalid">{errors.quantity?.message}</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3" controlId="approvalDate">
                <FloatingLabel controlId="approvalDate" label="Data de Aprovação">
                  <Form.Control type="date" {...register("approvalDate")} isInvalid={!!errors.approvalDate} />
                  <Form.Control.Feedback type="invalid">{errors.approvalDate?.message}</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3" controlId="observations">
                <FloatingLabel controlId="observations" label="Observações">
                  <Form.Control as="textarea" {...register("observations")} isInvalid={!!errors.observations} />
                  <Form.Control.Feedback type="invalid">{errors.observations?.message}</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
            </Container>
          </fieldset>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
        {buttonVisible && (
          <Button variant={formColor} onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? submittingButtonText : buttonText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
