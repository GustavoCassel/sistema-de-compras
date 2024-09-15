import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useEffect, useState } from "react";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import Loading from "../../components/Loading";
import { APP_CURRENCY_LOCALE_FORMAT, CrudOperation, DATE_FORMAT } from "../../data/constants";
import { Quotation, quotationRepository } from "../../models/QuotationRepository";
import { Supplier, supplierRepository } from "../../models/SupplierRepository";
import { Toast } from "../../utils/Alerts";
import CurrencyInput, { CurrencyInputOnChangeValues } from "react-currency-input-field";

type QuotationModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  crudOperation: CrudOperation;
  quotation?: Quotation;
  updateTable: () => void;
  purchaseRequestId: string;
};

const schema = z.object({
  quotationDate: z
    .string()
    .min(1, "Data da Solicitação é obrigatória")
    .refine((value) => moment(value, DATE_FORMAT).isValid(), { message: "Data inválida" }),
  supplierId: z.string().min(1, "Fornecedor é obrigatório"),
  purchaseRequestId: z.string().min(1, "Requisição é obrigatória"),
  price: z.number().min(0.01, "Preço é obrigatório"),
  observations: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function QuotationModal({ visible, setVisible, crudOperation, quotation, updateTable, purchaseRequestId }: QuotationModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: new Quotation(),
  });

  const [buttonText, setButtonText] = useState("");
  const [buttonVisible, setButtonVisible] = useState(false);
  const [submittingButtonText, setSubmittingButtonText] = useState("");
  const [headerIcon, setHeaderIcon] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [formColor, setFormColor] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);

  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const price = watch("price");

  async function loadSuppliers() {
    setLoadingSuppliers(true);
    try {
      const suppliers = await supplierRepository.getAllActive();

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

    if (crudOperation === CrudOperation.Create || crudOperation === CrudOperation.Update) {
      loadSuppliers();
    }
  }, [crudOperation, quotation, visible]);

  function updateFormByCrudOperation() {
    setFormDisabled(false);
    setButtonVisible(true);
    if (crudOperation === CrudOperation.Create) {
      setValue("purchaseRequestId", purchaseRequestId);
      setSubmittingButtonText("Cadastrando...");
      setButtonText("Cadastrar");
      setHeaderText("Cadastrar Cotação");
      setHeaderIcon("bi bi-plus-square");
      setFormColor("primary");
    } else if (crudOperation === CrudOperation.Update) {
      setSubmittingButtonText("Atualizando...");
      setButtonText("Atualizar");
      setHeaderText("Atualizar Cotação");
      setHeaderIcon("bi bi-pencil-square");
      setFormColor("warning");
    } else if (crudOperation === CrudOperation.Delete) {
      setSubmittingButtonText("Excluindo...");
      setFormDisabled(true);
      setButtonText("Confirma exclusão?");
      setHeaderText("Excluir Cotação");
      setHeaderIcon("bi bi-trash");
      setFormColor("danger");
    } else if (crudOperation === CrudOperation.Read) {
      setFormDisabled(true);
      setButtonVisible(false);
      setHeaderText("Detalhes da Cotação");
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
    reset(quotation || new Quotation(), { keepValues: false });

    if (crudOperation === CrudOperation.Create) {
      return;
    }

    trigger();
  }

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const parsed = schema.parse(formData) as Quotation;

    try {
      if (crudOperation === CrudOperation.Delete) {
        await quotationRepository.delete(quotation!.id);
      } else if (crudOperation === CrudOperation.Create) {
        await quotationRepository.create(parsed);
      } else if (crudOperation === CrudOperation.Update) {
        await quotationRepository.update(quotation!.id, parsed);
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
              <FloatingLabel label="Data da Cotação" className="mb-3">
                <Form.Control type="datetime" {...register("quotationDate")} isInvalid={!!errors.quotationDate} disabled />
                <Form.Control.Feedback type="invalid">{errors.quotationDate?.message}</Form.Control.Feedback>
              </FloatingLabel>

              <FloatingLabel label="Requisição de Compra" className="mb-3">
                <Form.Control type="text" {...register("purchaseRequestId")} isInvalid={!!errors.purchaseRequestId} disabled />
                <Form.Control.Feedback type="invalid">{errors.purchaseRequestId?.message}</Form.Control.Feedback>
              </FloatingLabel>

              {loadingSuppliers ? (
                <Loading className="mb-3" />
              ) : (
                <FloatingLabel label="Fornecedor" className="mb-3">
                  <Controller
                    {...register("supplierId")}
                    control={control}
                    render={({ field }) => (
                      <Form.Select {...field} isInvalid={!!errors.supplierId}>
                        <option value="">Selecione um fornecedor</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  />
                  <Form.Control.Feedback type="invalid">{errors.supplierId?.message}</Form.Control.Feedback>
                </FloatingLabel>
              )}

              <FloatingLabel label="Preço" className="mb-3">
                <Form.Control
                  as={CurrencyInput}
                  onValueChange={(_value: string | undefined, _name?: string, values?: CurrencyInputOnChangeValues) => {
                    setValue("price", values?.float || 0);
                    trigger("price");
                  }}
                  type="text"
                  placeholder=""
                  allowDecimals={true}
                  decimalsLimit={2}
                  allowNegativeValue={false}
                  intlConfig={APP_CURRENCY_LOCALE_FORMAT}
                  isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">{errors.price?.message}</Form.Control.Feedback>
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
