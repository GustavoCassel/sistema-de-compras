import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactInputMask from "react-input-mask";
import Swal from "sweetalert2";
import { z } from "zod";
import { CrudOperation, PHONE_MASK } from "../../data/constants";
import { Contact, contactRepository } from "../../models/ContactRepository";
import { Toast } from "../../utils/Alerts";
import { Supplier, supplierRepository } from "../../models/SupplierRepository";

type ContactModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  crudOperation: CrudOperation;
  contact?: Contact;
  updateContactsTable: () => void;
};

const SUPPLIER_ID_EMPTY = "Selecione um fornecedor";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  active: z.boolean(),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(15, "Telefone é obrigatório"),
  supplierId: z
    .string()
    .min(1, { message: "Fornecedor é obrigatório" })
    .refine((value) => value !== SUPPLIER_ID_EMPTY, { message: "Fornecedor é obrigatório" }),
});

type FormData = z.infer<typeof schema>;

export default function ContactModal({ visible, setVisible, crudOperation, contact, updateContactsTable }: ContactModalProps) {
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
    defaultValues: new Contact(),
  });

  const [buttonText, setButtonText] = useState("");
  const [buttonVisible, setButtonVisible] = useState(false);
  const [submittingButtonText, setSubmittingButtonText] = useState("");
  const [headerIcon, setHeaderIcon] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [formColor, setFormColor] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    setFieldsIntoModal();

    updateSuppliers();

    updateFormByCrudOperation();
  }, [crudOperation, contact, visible]);

  function updateFormByCrudOperation() {
    setFormDisabled(false);
    setButtonVisible(true);
    if (crudOperation === CrudOperation.Create) {
      setSubmittingButtonText("Cadastrando...");
      setButtonText("Cadastrar");
      setHeaderText("Cadastrar Contato");
      setHeaderIcon("bi bi-plus-square");
      setFormColor("primary");
      setValue("active", true);
    } else if (crudOperation === CrudOperation.Update) {
      setSubmittingButtonText("Atualizando...");
      setButtonText("Atualizar");
      setHeaderText("Atualizar Contato");
      setHeaderIcon("bi bi-pencil-square");
      setFormColor("warning");
    } else if (crudOperation === CrudOperation.Delete) {
      setSubmittingButtonText("Excluindo...");
      setFormDisabled(true);
      setButtonText("Confirma exclusão?");
      setHeaderText("Excluir Contato");
      setHeaderIcon("bi bi-trash");
      setFormColor("danger");
    } else if (crudOperation === CrudOperation.Read) {
      setFormDisabled(true);
      setButtonVisible(false);
      setHeaderText("Detalhes do Contato");
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
    reset(contact || new Contact(), { keepValues: false });

    if (crudOperation === CrudOperation.Create) {
      return;
    }

    trigger();
  }

  async function updateSuppliers() {
    if (crudOperation === CrudOperation.Delete || crudOperation === CrudOperation.Read) {
      return;
    }

    const suppliers = await supplierRepository.getAll();

    setSuppliers(suppliers);
  }

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const parsedContact = schema.parse(formData) as Contact;

    try {
      if (crudOperation === CrudOperation.Delete) {
        await contactRepository.delete(contact!.id);
      } else if (crudOperation === CrudOperation.Create) {
        await contactRepository.create(parsedContact);
      } else if (crudOperation === CrudOperation.Update) {
        await contactRepository.update(contact!.id, parsedContact);
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

    updateContactsTable();

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

            <FloatingLabel label="Nome" className="mb-3">
              <Form.Control type="text" placeholder="" isInvalid={!!errors.name} {...register("name")} />
              <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
              <Form.Control type="email" placeholder="" isInvalid={!!errors.email} {...register("email")} />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="Telefone" className="mb-3">
              <Form.Control
                as={ReactInputMask}
                type="text"
                placeholder=""
                mask={PHONE_MASK}
                maskChar={null}
                isInvalid={!!errors.phone}
                {...register("phone")}
              />
              <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="Fornecedor" className="mb-3">
              <Controller
                {...register("supplierId")}
                control={control}
                render={({ field }) => (
                  <Form.Select {...field} isInvalid={!!errors.supplierId} defaultValue={SUPPLIER_ID_EMPTY}>
                    <option key={SUPPLIER_ID_EMPTY} value={SUPPLIER_ID_EMPTY}>
                      {SUPPLIER_ID_EMPTY}
                    </option>
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
