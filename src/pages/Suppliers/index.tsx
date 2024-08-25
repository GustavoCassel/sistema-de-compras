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
  const [supplier, setSupplier] = useState<Supplier | undefined>();

  useEffect(() => {
    updateSupplierTable();
  }, []);

  function updateSupplierTable() {
    SupplierRepository.getAll().then((suppliers) => {
      setSuppliers(suppliers);
      setLoading(false);
    });
  }

  function showModal(crudOperation: CrudOperation, supplier?: Supplier) {
    setModalVisible(true);
    setCrudOperation(crudOperation);
    setSupplier(supplier);
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h2>Fornecedores</h2>
        <Button variant="primary" onClick={() => showModal(CrudOperation.Create)}>
          <i className="bi bi-plus-square me-2" />
          Cadastrar
        </Button>
      </div>
      <SupplierModal
        visible={modalVisible}
        setVisible={setModalVisible}
        crudOperation={crudOperation}
        supplier={supplier}
        updateSupplierTable={updateSupplierTable}
      />
      {loading ? <Loading /> : <SuppliersTable suppliers={suppliers} showModal={showModal} />}
    </div>
  );
}
