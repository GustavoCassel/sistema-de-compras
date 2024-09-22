import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import ExportCsvButton from "../../components/ExportCsvButton";
import Loading from "../../components/Loading";
import { CrudOperation } from "../../data/constants";
import { Supplier, supplierRepository } from "../../models/SupplierRepository";
import SupplierModal from "./SupplierModal";
import SuppliersTable from "./SuppliersTable";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [crudOperation, setCrudOperation] = useState<CrudOperation>(CrudOperation.Create);
  const [supplier, setSupplier] = useState<Supplier | undefined>();

  useEffect(() => {
    updateTable();
  }, []);

  async function updateTable() {
    setLoading(true);
    try {
      const suppliers = await supplierRepository.getAll();

      setSuppliers(suppliers);
    } catch (error) {
      const err = error as Error;
      Swal.fire({
        icon: "error",
        title: "Erro ao carregar contatos",
        html: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  function showModal(crudOperation: CrudOperation, supplier?: Supplier) {
    setModalVisible(true);
    setCrudOperation(crudOperation);
    setSupplier(supplier);
  }

  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>Fornecedores</h2>
        <Button variant="primary" onClick={() => showModal(CrudOperation.Create)}>
          <i className="bi bi-plus-square me-2" />
          Cadastrar
        </Button>
      </div>
      <SupplierModal visible={modalVisible} setVisible={setModalVisible} crudOperation={crudOperation} supplier={supplier} updateSupplierTable={updateTable} />
      {loading ? <Loading /> : <SuppliersTable suppliers={suppliers} showModal={showModal} />}
      {suppliers.length !== 0 && <ExportCsvButton data={suppliers} filename="fornecedores.csv" />}
    </>
  );
}
