import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button, Container, FloatingLabel, Form, Modal } from "react-bootstrap";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactInputMask from "react-input-mask";
import Swal from "sweetalert2";
import { z } from "zod";
import { CEP_MASK, CEP_REGEX, CNPJ_MASK, CNPJ_REGEX, CPF_MASK, CPF_REGEX, CrudOperation } from "../../data/constants";
import { contactRepository } from "../../models/ContactRepository";
import { Supplier, SUPPLIER_TYPES, supplierRepository, SupplierType } from "../../models/SupplierRepository";
import ViaCepService from "../../services/ViaCepService";
import { Toast } from "../../utils/Alerts";
import SupplierContactsTable from "./SupplierContactsTable";

type SupplierModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  crudOperation: CrudOperation;
  supplier?: Supplier;
  updateSupplierTable: () => void;
};

const schema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    active: z.boolean(),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().regex(/^[A-Z]{2}$/, "Somente sigla do estado"),
    document: z.string().min(1, "Documento é obrigatório"),
    cep: z.string().regex(CEP_REGEX, "CEP inválido"),
    supplierType: z.nativeEnum(SupplierType, { message: "Tipo de fornecedor inválido" }),
  })
  .superRefine((data, ctx) => {
    const { supplierType, document } = data;

    if (supplierType === SupplierType.Physical && !CPF_REGEX.test(document)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Documento inválido para CPF",
        path: ["document"],
      });
    }

    if (supplierType === SupplierType.Legal && !CNPJ_REGEX.test(document)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Documento inválido para CNPJ",
        path: ["document"],
      });
    }
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
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: new Supplier(),
  });

  const [buttonText, setButtonText] = useState("");
  const [buttonVisible, setButtonVisible] = useState(false);
  const [submittingButtonText, setSubmittingButtonText] = useState("");
  const [headerIcon, setHeaderIcon] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [formColor, setFormColor] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);

  const watchSupplierType = watch("supplierType");
  const cep = watch("cep");

  useEffect(() => {
    if (crudOperation !== CrudOperation.Create) {
      return;
    }

    fullFillAddress();
  }, [cep]);

  async function fullFillAddress() {
    const onlyNumbers = cep.replace(/\D/g, "");
    if (!onlyNumbers || onlyNumbers.length !== 8) {
      return;
    }

    const result = await Swal.fire({
      icon: "question",
      title: "Preencher endereço automaticamente?",
      text: "Deseja preencher o endereço automaticamente?",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    });

    if (result.isDismissed) {
      return;
    }

    try {
      const address = await ViaCepService.getAddress(onlyNumbers);

      setValue("city", address.localidade);
      trigger("city");
      setValue("state", address.uf);
      trigger("state");
      setValue("cep", address.cep);
      trigger("cep");

      Toast.fire({
        icon: "success",
        title: "Endereço preenchido automaticamente",
      });
    } catch (error) {
      const err = error as Error;
      Swal.fire({
        icon: "error",
        title: "Erro ao preencher endereço",
        text: err.message,
      });
    }
  }

  useEffect(() => {
    if (!visible) {
      return;
    }
    setFieldsIntoModal();

    updateFormByCrudOperation();
  }, [crudOperation, supplier, visible]);

  function updateFormByCrudOperation() {
    setFormDisabled(false);
    setButtonVisible(true);
    if (crudOperation === CrudOperation.Create) {
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
      setHeaderText("Detalhes do Fornecedor");
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
    reset(supplier || new Supplier(), { keepValues: false });

    if (crudOperation === CrudOperation.Create) {
      return;
    }

    trigger();
  }

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const parsedSupplier = schema.parse(formData) as Supplier;

    try {
      if (crudOperation === CrudOperation.Delete) {
        const result = await Swal.fire({
          icon: "warning",
          title: "Exclusão de Contatos vinculados",
          text: "Ao excluir esse fornecedor, todos os contatos relacionados também serão excluídos. Deseja continuar?",
          showCancelButton: true,
          confirmButtonText: "Sim, excluir",
          cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) {
          return;
        }

        await contactRepository.deleteByField("supplierId", supplier!.id);
        await supplierRepository.delete(supplier!.id);
      } else if (crudOperation === CrudOperation.Create) {
        await supplierRepository.create(parsedSupplier);
      } else if (crudOperation === CrudOperation.Update) {
        await supplierRepository.update(supplier!.id, parsedSupplier);
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

            <FloatingLabel label={watchSupplierType === SupplierType.Legal ? "Razão Social" : "Nome"} className="mb-3">
              <Form.Control type="text" placeholder="" isInvalid={!!errors.name} {...register("name")} />
              <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="CEP" className="mb-3">
              <Form.Control as={ReactInputMask} type="text" placeholder="" mask={CEP_MASK} maskChar={null} isInvalid={!!errors.cep} {...register("cep")} />
              <Form.Control.Feedback type="invalid">{errors.cep?.message}</Form.Control.Feedback>
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

            <FloatingLabel label="Tipo Pessoa" className="mb-3">
              <Controller
                {...register("supplierType")}
                control={control}
                render={({ field }) => (
                  <>
                    <Form.Select {...field}>
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

            {supplier && (
              <>
                <Form.Text>Informações de contato</Form.Text>
                <SupplierContactsTable supplier={supplier} />
              </>
            )}
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
