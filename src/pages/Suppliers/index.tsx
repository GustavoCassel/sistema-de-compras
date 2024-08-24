import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Loading from "../../components/Loading";
import { CrudOperation } from "../../data/constants";
import { Supplier, SupplierRepository } from "../../models/SupplierRepository";
import SupplierModal from "./SupplierModal";
import SuppliersTable from "./SuppliersTable";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [crudOperation, setCrudOperation] = useState<CrudOperation>(CrudOperation.Create);
  const [id, setId] = useState<string | undefined>();

  useEffect(() => {
    updateSupplierTable();
  }, []);

  function updateSupplierTable() {
    SupplierRepository.getAll().then((suppliers) => {
      setSuppliers(suppliers);
      setLoading(false);
    });
  }

  function showModal(crudOperation: CrudOperation, id?: string) {
    setModalVisible(true);
    setCrudOperation(crudOperation);
    setId(id);
  }

  return (
    <div>
      <h2 className="text-center">Fornecedores</h2>

      <Button variant="primary" className=" float-end" onClick={() => showModal(CrudOperation.Create)}>
        <i className="bi bi-plus-square me-2" />
        Cadastrar Fornecedor
      </Button>

      <SupplierModal visible={modalVisible} setVisible={setModalVisible} crudOperation={crudOperation} id={id} updateSupplierTable={updateSupplierTable} />

      {loading ? <Loading /> : <SuppliersTable suppliers={suppliers} showModal={showModal} />}
    </div>
  );
}
