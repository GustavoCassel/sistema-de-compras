import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactInputMask from "react-input-mask";
import Swal from "sweetalert2";
import { z } from "zod";
import { CEP_MASK, CNPJ_MASK, CPF_MASK, CrudOperation } from "../../data/constants";
import { Supplier, SUPPLIER_TYPES, SupplierRepository, SupplierType } from "../../models/SupplierRepository";
import { Toast } from "../../utils/Alerts";

type SupplierModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  crudOperation: CrudOperation;
  supplier?: Supplier;
  updateSupplierTable: () => void;
};

// TODO: configure validation schema and the input mask for the document field, considering the supplierType
const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  active: z.boolean(),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().regex(/^[A-Z]{2}$/, "Somente sigla do estado"),
  document: z.string(),
  cep: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
  supplierType: z.nativeEnum(SupplierType, { message: "Tipo de fornecedor inválido" }),
});

type FormData = z.infer<typeof schema>;

export default function SupplierModal({ visible, setVisible, crudOperation, supplier, updateSupplierTable }: SupplierModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: new Supplier(),
  });

  const [buttonActive, setButtonActive] = useState(true);
  const [buttonText, setButtonText] = useState("");
  const [buttonVisible, setButtonVisible] = useState(false);
  const [submittingButtonText, setSubmittingButtonText] = useState("");
  const [headerIcon, setHeaderIcon] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [formColor, setFormColor] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);

  const watchSupplierType = watch("supplierType");

  useEffect(() => {
    setSupplierFieldsIntoForm();

    updateFormByCrudOperation();
  }, [crudOperation, supplier, visible]);

  function updateFormByCrudOperation() {
    setFormDisabled(false);
    setButtonVisible(true);
    if (crudOperation === CrudOperation.Create) {
      reset(new Supplier(), { keepValues: false });
      setSubmittingButtonText("Cadastrando...");
      setButtonText("Cadastrar");
      setHeaderText("Cadastrar Fornecedor");
      setHeaderIcon("bi bi-plus-square");
      setFormColor("primary");
      setValue("active", true);
    } else if (crudOperation === CrudOperation.Update) {
      setSubmittingButtonText("Atualizando...");
      setButtonText("Atualizar");
      setHeaderText("Atualizar Fornecedor");
      setHeaderIcon("bi bi-pencil-square");
      setFormColor("warning");
    } else if (crudOperation === CrudOperation.Delete) {
      setSubmittingButtonText("Excluindo...");
      setFormDisabled(true);
      setButtonText("Confirma exclusão?");
      setHeaderText("Excluir Fornecedor");
      setHeaderIcon("bi bi-trash");
      setFormColor("danger");
    } else if (crudOperation === CrudOperation.Read) {
      setFormDisabled(true);
      setButtonVisible(false);
      setHeaderText("Detalhes Fornecedor");
      setHeaderIcon("bi bi-info-square");
      setFormColor("info");
    } else {
      throw new Error("Operação não permitida");
    }
  }

  function handleClose() {
    setVisible(false);
  }

  function setSupplierFieldsIntoForm() {
    if (!supplier) return;
    setValue("name", supplier!.name);
    setValue("active", supplier!.active);
    setValue("city", supplier!.city);
    setValue("state", supplier!.state);
    setValue("document", supplier!.document);
    setValue("cep", supplier!.cep);
    setValue("supplierType", supplier!.supplierType);
  }

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const parsedSupplier = schema.parse(formData) as Supplier;

    setButtonActive(false);

    try {
      if (crudOperation === CrudOperation.Delete) {
        await SupplierRepository.delete(supplier!.id);
      } else if (crudOperation === CrudOperation.Create) {
        await SupplierRepository.create(parsedSupplier);
      } else if (crudOperation === CrudOperation.Update) {
        await SupplierRepository.update(supplier!.id, parsedSupplier);
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
    } finally {
      setButtonActive(true);
    }

    Toast.fire({
      icon: "success",
      title: crudOperation === CrudOperation.Delete ? "Excluído com sucesso!" : "Salvo com sucesso!",
    });

    updateSupplierTable();

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
            <FloatingLabel label="Nome" className="mb-3">
              <Form.Control type="text" placeholder="" isInvalid={!!errors.name} {...register("name")} />
              <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="Cidade" className="mb-3">
              <Form.Control type="text" placeholder="" isInvalid={!!errors.city} {...register("city")} />
              <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="Estado" className="mb-3">
              <Form.Control
                as={ReactInputMask}
                type="text"
                placeholder=""
                mask={"aa"}
                maskChar={null}
                isInvalid={!!errors.state}
                {...register("state")}
                onChange={(e) => setValue("state", e.target.value.toUpperCase(), { shouldValidate: true })}
              />
              <Form.Control.Feedback type="invalid">{errors.state?.message}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label={watchSupplierType === SupplierType.Legal ? "CNPJ" : "CPF"} className="mb-3">
              <Form.Control
                as={ReactInputMask}
                type="text"
                placeholder=""
                mask={watchSupplierType === SupplierType.Legal ? CNPJ_MASK : CPF_MASK}
                maskChar={null}
                isInvalid={!!errors.document}
                {...register("document")}
              />
              <Form.Control.Feedback type="invalid">{errors.document?.message}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="CEP" className="mb-3">
              <Form.Control as={ReactInputMask} type="text" placeholder="" mask={CEP_MASK} maskChar={null} isInvalid={!!errors.cep} {...register("cep")} />
              <Form.Control.Feedback type="invalid">{errors.cep?.message}</Form.Control.Feedback>
            </FloatingLabel>

            <Form.Label>Tipo Pessoa</Form.Label>
            <Controller
              {...register("supplierType")}
              control={control}
              render={({ field }) => (
                <>
                  <Form.Select className="mb-2" {...field}>
                    {SUPPLIER_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.supplierType?.message}</Form.Control.Feedback>
                </>
              )}
            />

            <Container className="d-flex">
              <Form.Label className="me-3">Status:</Form.Label>
              <Controller
                {...register("active")}
                control={control}
                render={({ field }) => (
                  <>
                    <Form.Switch label={field.value ? "Ativo" : "Inativo"} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                    <Form.Control.Feedback type="invalid">{errors.active?.message}</Form.Control.Feedback>
                  </>
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.active?.message}</Form.Control.Feedback>
            </Container>
          </fieldset>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
        {buttonVisible && (
          <Button variant={formColor} onClick={handleSubmit(onSubmit)} disabled={!buttonActive}>
            {isSubmitting ? submittingButtonText : buttonText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
