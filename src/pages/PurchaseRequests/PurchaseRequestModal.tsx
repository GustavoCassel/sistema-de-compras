import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Button, Container, FloatingLabel, Form, Modal } from "react-bootstrap";
import CurrencyInput, { CurrencyInputOnChangeValues } from "react-currency-input-field";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { FirebaseUserContext } from "../../App";
import Loading from "../../components/Loading";
import { CrudOperation, DATE_FORMAT } from "../../data/constants";
import { Product, productRepository } from "../../models/ProductRepository";
import { PurchaseRequest, purchaseRequestRepository } from "../../models/PurchaseRequestRepository";
import { quotationRepository } from "../../models/QuotationRepository";
import { Toast } from "../../utils/Alerts";

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
    .refine((value) => moment(value, DATE_FORMAT).isValid(), { message: "Data inválida" }),
  requesterEmail: z.string().min(1, "Solicitante é obrigatório"),
  productId: z.string().min(1, "Produto é obrigatório"),
  quantity: z.coerce
    .string()
    .transform((val) => parseFloat(val.replace(",", ".")))
    .refine((value) => value > 0, { message: "Quantidade deve ser maior que zero" }),
  observations: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function PurchaseRequestModal({ visible, setVisible, crudOperation, purchaseRequest, updateTable }: PurchaseRequestModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
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

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const currentFirebaseUser = useContext(FirebaseUserContext);

  async function loadProducts() {
    setLoadingProducts(true);
    try {
      const products = await productRepository.getAllActive();

      setProducts(products);
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    if (!visible) {
      return;
    }
    setFieldsIntoModal();

    updateFormByCrudOperation();

    if (crudOperation === CrudOperation.Create || crudOperation === CrudOperation.Update) {
      loadProducts();
    }
  }, [crudOperation, purchaseRequest, visible]);

  function updateFormByCrudOperation() {
    setFormDisabled(false);
    setButtonVisible(true);
    if (crudOperation === CrudOperation.Create) {
      setValue("requesterEmail", currentFirebaseUser?.email!);
      setSubmittingButtonText("Cadastrando...");
      setButtonText("Cadastrar");
      setHeaderText("Cadastrar Solicitação de Compra");
      setHeaderIcon("bi bi-plus-square");
      setFormColor("primary");
    } else if (crudOperation === CrudOperation.Update) {
      setSubmittingButtonText("Atualizando...");
      setButtonText("Atualizar");
      setHeaderText("Atualizar Solicitação de Compra");
      setHeaderIcon("bi bi-pencil-square");
      setFormColor("warning");
    } else if (crudOperation === CrudOperation.Delete) {
      setSubmittingButtonText("Excluindo...");
      setFormDisabled(true);
      setButtonText("Confirma exclusão?");
      setHeaderText("Excluir Solicitação de Compra");
      setHeaderIcon("bi bi-trash");
      setFormColor("danger");
    } else if (crudOperation === CrudOperation.Read) {
      setFormDisabled(true);
      setButtonVisible(false);
      setHeaderText("Detalhes da Solicitação de Compra");
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

    try {
      if (crudOperation === CrudOperation.Delete) {
        const result = await Swal.fire({
          icon: "warning",
          title: "Exclusão de Cotações vinculadas",
          text: "Ao excluir essa solicitação de compra, todas as cotações relacionadas serão excluídas. Deseja continuar?",
          showCancelButton: true,
          confirmButtonText: "Sim, excluir",
          cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) {
          return;
        }

        await quotationRepository.deleteByField("purchaseRequestId", purchaseRequest!.id);
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
              <FloatingLabel label="Data da Solicitação" className="mb-3">
                <Form.Control type="datetime" {...register("requestDate")} isInvalid={!!errors.requestDate} disabled />
                <Form.Control.Feedback type="invalid">{errors.requestDate?.message}</Form.Control.Feedback>
              </FloatingLabel>

              <FloatingLabel label="Solicitante" className="mb-3">
                <Form.Control type="text" placeholder="" isInvalid={!!errors.requesterEmail} {...register("requesterEmail")} disabled />
                <Form.Control.Feedback type="invalid">{errors.requesterEmail?.message}</Form.Control.Feedback>
              </FloatingLabel>

              {loadingProducts ? (
                <Loading className="mb-3" />
              ) : (
                <FloatingLabel label="Produto" className="mb-3">
                  <Controller
                    {...register("productId")}
                    control={control}
                    render={({ field }) => (
                      <Form.Select {...field} isInvalid={!!errors.productId}>
                        <option value="">Selecione um produto</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  />
                  <Form.Control.Feedback type="invalid">{errors.productId?.message}</Form.Control.Feedback>
                </FloatingLabel>
              )}

              <FloatingLabel label="Quantidade" className="mb-3">
                <Controller
                  control={control}
                  name="quantity"
                  render={({ field }) => (
                    <Form.Control
                      as={CurrencyInput}
                      placeholder=""
                      value={field.value}
                      decimalScale={2}
                      decimalsLimit={2}
                      isInvalid={!!errors.quantity}
                      onValueChange={(_value: string | undefined, _name?: string, values?: CurrencyInputOnChangeValues) => {
                        field.onChange(values?.value);
                      }}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">{errors.quantity?.message}</Form.Control.Feedback>
              </FloatingLabel>

              <FloatingLabel label="Observações" className="mb-3">
                <Form.Control as="textarea" placeholder="" {...register("observations")} isInvalid={!!errors.observations} />
                <Form.Control.Feedback type="invalid">{errors.observations?.message}</Form.Control.Feedback>
              </FloatingLabel>
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
