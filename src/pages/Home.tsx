import { useState } from "react";
import Button from "react-bootstrap/Button";
import SupplierModal from "./Suppliers/SupplierModal";
import { CrudOperation } from "../data/constants";

export default function Home() {
  const [show, setShow] = useState(false);
  const [crudOperation, setCrudOperation] = useState<CrudOperation>(CrudOperation.Create);

  function handleCreate() {
    setCrudOperation(CrudOperation.Create);
    setShow(true);
  }

  function handleRead() {
    setCrudOperation(CrudOperation.Read);
    setShow(true);
  }

  function handleUpdate() {
    setCrudOperation(CrudOperation.Update);
    setShow(true);
  }

  function handleDelete() {
    setCrudOperation(CrudOperation.Delete);
    setShow(true);
  }

  return (
    <>
      <Button variant="primary" onClick={handleCreate}>
        Cadastrar fornecedor
      </Button>

      <Button variant="info" onClick={handleRead}>
        Detalhes fornecedor
      </Button>

      <Button variant="warning" onClick={handleUpdate}>
        Atualizar fornecedor
      </Button>

      <Button variant="danger" onClick={handleDelete}>
        Excluir fornecedor
      </Button>

      <SupplierModal visible={show} setVisible={setShow} crudOperation={crudOperation} />
    </>
  );

  return (
    <div className="text-center mt-5">
      <h2>Sistema de Compras</h2>
      <p>Bem-vindo ao sistema de compras!</p>
    </div>
  );
}
