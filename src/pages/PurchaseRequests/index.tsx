import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { FirebaseUserContext } from "../../App";
import ExportCsvButton from "../../components/ExportCsvButton";
import Loading from "../../components/Loading";
import { CrudOperation, DATE_FORMAT } from "../../data/constants";
import { PurchaseRequest, purchaseRequestRepository } from "../../models/PurchaseRequestRepository";
import PurchaseRequestModal from "./PurchaseRequestModal";
import PurchaseRequestsTable from "./PurchaseRequestsTable";

export default function PurchaseRequests() {
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | undefined>();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [crudOperation, setCrudOperation] = useState<CrudOperation>(CrudOperation.Create);

  const currentFirebaseUser = useContext(FirebaseUserContext);

  function showModal(crudOperation: CrudOperation, purchaseRequest?: PurchaseRequest) {
    setModalVisible(true);
    setCrudOperation(crudOperation);
    setSelectedRequest(purchaseRequest);
  }

  useEffect(() => {
    updateTable();
  }, [currentFirebaseUser]);

  async function updateTable() {
    setLoading(true);
    try {
      if (!currentFirebaseUser) {
        return;
      }

      let requests: PurchaseRequest[];

      if (currentFirebaseUser.isAdmin) {
        requests = await purchaseRequestRepository.getAll();
      } else {
        requests = await purchaseRequestRepository.getByField("requesterEmail", currentFirebaseUser.email);
      }

      await purchaseRequestRepository.fullFillFirebaseUsers(requests);

      await purchaseRequestRepository.fullFillProducts(requests);

      await purchaseRequestRepository.fullFillStatus(requests);

      // (da mais antiga para a mais nova)
      requests = requests.sort((a, b) => {
        const dateA = moment(a.requestDate, DATE_FORMAT);
        const dateB = moment(b.requestDate, DATE_FORMAT);

        if (dateA.isBefore(dateB)) {
          return -1;
        } else if (dateA.isAfter(dateB)) {
          return 1;
        }

        return 0;
      });

      setPurchaseRequests(requests);
    } catch (error) {
      const err = error as Error;
      Swal.fire({
        icon: "error",
        title: "Erro ao carregar requisições de compra",
        html: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>{currentFirebaseUser?.isAdmin ? "Todas as Requisições de Compra" : "Suas Requisições de Compra"}</h2>
        {!currentFirebaseUser?.isAdmin && (
          <Button variant="primary" onClick={() => showModal(CrudOperation.Create)}>
            <i className="bi bi-plus-square me-2" />
            Cadastrar
          </Button>
        )}
      </div>
      <PurchaseRequestModal
        visible={modalVisible}
        setVisible={setModalVisible}
        crudOperation={crudOperation}
        purchaseRequest={selectedRequest}
        updateTable={updateTable}
      />
      {loading ? (
        <Loading />
      ) : (
        <PurchaseRequestsTable
          showRequester={!!currentFirebaseUser?.isAdmin}
          purchaseRequests={purchaseRequests}
          showModal={showModal}
          firebaseUser={currentFirebaseUser}
        />
      )}
      {purchaseRequests.length !== 0 && <ExportCsvButton data={purchaseRequests} filename="requisicoes_de_compra.csv" />}
    </>
  );
}
