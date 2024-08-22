import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { CEP_MASK, CNPJ_MASK, CPF_MASK, CrudOperation } from "../../data/constants";
import { SupplierType, SUPPLIER_TYPES } from "../../models/SupplierRepository";
import ReactInputMask from "react-input-mask";

type SupplierModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  crudOperation: CrudOperation;
};

// TODO: configure validation schema and the input mask for the document field, considering the supplierType
const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  active: z.boolean(),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().regex(/^[A-Z]{2}$/, "Somente sigla do estado"),
  document: z.string(),
  cep: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
  supplierType: z.nativeEnum(SupplierType, { message: "Tipo de fornecedor deve ser 'Física' ou 'Jurídica'" }),
});

type FormData = z.infer<typeof schema>;

export default function SupplierModal({ visible, setVisible, crudOperation }: SupplierModalProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [buttonActive, setButtonActive] = useState(true);
  const [buttonText, setButtonText] = useState("");
  const [headerIcon, setHeaderIcon] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [formColor, setFormColor] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);

  const watchSupplierType = watch("supplierType");

  useEffect(() => {
    if (!visible) return;
    updateFormByCrudOperation();
  }, [visible]);

  function updateFormByCrudOperation() {
    setFormDisabled(false);
    if (crudOperation === CrudOperation.Create) {
      setButtonText("Cadastrar");
      setHeaderText("Cadastrar Fornecedor");
      setHeaderIcon("bi bi-plus-square");
      setFormColor("primary");
    } else if (crudOperation === CrudOperation.Update) {
      setButtonText("Atualizar");
      setHeaderText("Atualizar Fornecedor");
      setHeaderIcon("bi bi-pencil-square");
      setFormColor("warning");
    } else if (crudOperation === CrudOperation.Delete) {
      setButtonText("Excluir");
      setHeaderText("Excluir Fornecedor");
      setHeaderIcon("bi bi-trash");
      setFormColor("danger");
    } else if (crudOperation === CrudOperation.Read) {
      setFormDisabled(true);
      setHeaderText("Detalhes Fornecedor");
      setHeaderIcon("bi bi-info-square");
      setFormColor("info");
    } else {
      throw new Error("Operação não permitida");
    }
  }

  function handleClose() {
    setVisible(false);
    reset();
  }

  const onSubmit: SubmitHandler<FormData> = async (supplier) => {};

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
          <FloatingLabel label="Nome" className="mb-3">
            <Form.Control type="text" placeholder="" isInvalid={!!errors.name} {...register("name")} disabled={formDisabled} />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel label="Cidade" className="mb-3">
            <Form.Control type="text" placeholder="" isInvalid={!!errors.city} {...register("city")} disabled={formDisabled} />
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
              disabled={formDisabled}
            />
            <Form.Control.Feedback type="invalid">{errors.state?.message}</Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel label={watchSupplierType === "Jurídica" ? "CNPJ" : "CPF"} className="mb-3">
            <Form.Control
              as={ReactInputMask}
              type="text"
              placeholder=""
              mask={watchSupplierType === "Jurídica" ? CNPJ_MASK : CPF_MASK}
              maskChar={null}
              isInvalid={!!errors.document}
              {...register("document")}
              disabled={formDisabled}
            />
            <Form.Control.Feedback type="invalid">{errors.document?.message}</Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel label="CEP" className="mb-3">
            <Form.Control
              as={ReactInputMask}
              type="text"
              placeholder=""
              mask={CEP_MASK}
              maskChar={null}
              isInvalid={!!errors.cep}
              {...register("cep")}
              disabled={formDisabled}
            />
            <Form.Control.Feedback type="invalid">{errors.cep?.message}</Form.Control.Feedback>
          </FloatingLabel>

          <Form.Label>Tipo Pessoa</Form.Label>
          <Controller
            {...register("supplierType")}
            control={control}
            disabled={formDisabled}
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
                  <Form.Switch
                    label={field.value ? "Ativo" : "Inativo"}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={formDisabled}
                  />
                  <Form.Control.Feedback type="invalid">{errors.active?.message}</Form.Control.Feedback>
                </>
              )}
            />
            <Form.Control.Feedback type="invalid">{errors.active?.message}</Form.Control.Feedback>
          </Container>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
        {!formDisabled && (
          <Button variant={formColor} onClick={handleSubmit(onSubmit)} disabled={!buttonActive}>
            {buttonText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
