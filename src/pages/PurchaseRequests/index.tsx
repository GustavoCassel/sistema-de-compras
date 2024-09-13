import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { CrudOperation } from "../../data/constants";
import { PurchaseRequest, purchaseRequestRepository } from "../../models/PurchaseRequestRepository";
import PurchaseRequestModal from "./PurchaseRequestModal";
import PurchaseRequestsTable from "./PurchaseRequestsTable";
import Swal from "sweetalert2";

export default function PurchaseRequests() {
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | undefined>();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [crudOperation, setCrudOperation] = useState<CrudOperation>(CrudOperation.Create);

  function showModal(crudOperation: CrudOperation, purchaseRequest?: PurchaseRequest) {
    setModalVisible(true);
    setCrudOperation(crudOperation);
    setSelectedRequest(purchaseRequest);
  }

  useEffect(() => {
    updateTable();
  }, []);

  async function updateTable() {
    setLoading(true);
    try {
      const requests = await purchaseRequestRepository.getAll();

      setPurchaseRequests(requests);
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

  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>Requisições de Compra</h2>
        <Button variant="primary" onClick={() => showModal(CrudOperation.Create)}>
          <i className="bi bi-plus-square me-2" />
          Cadastrar
        </Button>
      </div>
      <PurchaseRequestModal
        visible={modalVisible}
        setVisible={setModalVisible}
        crudOperation={crudOperation}
        purchaseRequest={selectedRequest}
        updateTable={updateTable}
      />
      <PurchaseRequestsTable purchaseRequests={purchaseRequests} showModal={showModal} />
    </>
  );
}
