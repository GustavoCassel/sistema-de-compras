import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { CrudOperation } from "../../data/constants";
import { MEASUREMENT_UNITS, MeasurementUnit, Product, productRepository } from "../../models/ProductRepository";
import { Toast } from "../../utils/Alerts";

type ProductModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  crudOperation: CrudOperation;
  product?: Product;
  updateTable: () => void;
};

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  active: z.boolean(),
  description: z.string().min(1, "Descrição é obrigatória"),
  observations: z.string().optional(),
  measurementUnit: z.nativeEnum(MeasurementUnit, { message: "Unidade de medida inválida" }),
});

type FormData = z.infer<typeof schema>;

export default function ProductModal({ visible, setVisible, crudOperation, product, updateTable }: ProductModalProps) {
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
    defaultValues: new Product(),
  });

  const [buttonText, setButtonText] = useState("");
  const [buttonVisible, setButtonVisible] = useState(false);
  const [submittingButtonText, setSubmittingButtonText] = useState("");
  const [headerIcon, setHeaderIcon] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [formColor, setFormColor] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }
    setFieldsIntoModal();

    updateFormByCrudOperation();
  }, [crudOperation, product, visible]);

  function updateFormByCrudOperation() {
    setFormDisabled(false);
    setButtonVisible(true);
    if (crudOperation === CrudOperation.Create) {
      setSubmittingButtonText("Cadastrando...");
      setButtonText("Cadastrar");
      setHeaderText("Cadastrar Produto");
      setHeaderIcon("bi bi-plus-square");
      setFormColor("primary");
      setValue("active", true);
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
    reset(product || new Product(), { keepValues: false });

    if (crudOperation === CrudOperation.Create) {
      return;
    }

    trigger();
  }

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const parsedProduct = schema.parse(formData) as Product;

    try {
      if (crudOperation === CrudOperation.Delete) {
        await productRepository.delete(product!.id);
      } else if (crudOperation === CrudOperation.Create) {
        await productRepository.create(parsedProduct);
      } else if (crudOperation === CrudOperation.Update) {
        await productRepository.update(product!.id, parsedProduct);
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

            <FloatingLabel label="Descrição" className="mb-3">
              <Form.Control type="text" placeholder="" isInvalid={!!errors.description} {...register("description")} />
              <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="Unidade de Medida" className="mb-3">
              <Controller
                {...register("measurementUnit")}
                control={control}
                render={({ field }) => (
                  <>
                    <Form.Select {...field}>
                      {MEASUREMENT_UNITS.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.measurementUnit?.message}</Form.Control.Feedback>
                  </>
                )}
              />
            </FloatingLabel>

            <FloatingLabel label="Observações" className="mb-3">
              <Form.Control as="textarea" placeholder="" isInvalid={!!errors.observations} {...register("observations")} />
              <Form.Control.Feedback type="invalid">{errors.observations?.message}</Form.Control.Feedback>
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
