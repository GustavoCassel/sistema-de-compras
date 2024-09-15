import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FirebaseUserContext } from "../../App";
import Loading from "../../components/Loading";
import { CrudOperation } from "../../data/constants";
import { PurchaseRequest, purchaseRequestRepository, PurchaseRequestStatus } from "../../models/PurchaseRequestRepository";
import { Quotation, quotationRepository } from "../../models/QuotationRepository";
import QuotationModal from "./QuotationModal";
import QuotationsTable from "./QuotationsTable";

export default function Quotations() {
  const [loading, setLoading] = useState(true);

  const [quotation, setSelectedQuotation] = useState<Quotation | undefined>();
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  const [purchaseRequest, setPurchaseRequest] = useState<PurchaseRequest | undefined>();

  const [modalVisible, setModalVisible] = useState(false);
  const [crudOperation, setCrudOperation] = useState<CrudOperation>(CrudOperation.Create);

  const currentFirebaseUser = useContext(FirebaseUserContext);

  const purchaseRequestId = useParams<{ id: string }>().id!;
  if (!purchaseRequestId) {
    throw new Error("ID da requisição de compra não informado");
  }

  async function showModal(crudOperation: CrudOperation, quotation?: Quotation) {
    if (crudOperation === CrudOperation.Create && purchaseRequest) {
      await purchaseRequestRepository.fullFillStatusSingle(purchaseRequest);

      if (purchaseRequest.status === PurchaseRequestStatus.Quoted) {
        Swal.fire({
          icon: "success",
          title: "Cotações já finalizadas",
          html: "O máximo de cotações já foi atingido para esta requisição de compra",
        });
        return;
      }
    }

    setModalVisible(true);
    setCrudOperation(crudOperation);
    setSelectedQuotation(quotation);
  }

  useEffect(() => {
    loadPurchaseRequest();
    updateTable();
  }, [currentFirebaseUser]);

  async function loadPurchaseRequest() {
    try {
      const request = await purchaseRequestRepository.getById(purchaseRequestId);
      if (!request) {
        throw new Error("Requisição de compra não encontrada");
      }

      setPurchaseRequest(request);
    } catch (error) {
      const err = error as Error;
      Swal.fire({
        icon: "error",
        title: "Erro ao carregar a requisição de compra",
        html: err.message,
      });
    }
  }

  async function updateTable() {
    setLoading(true);
    try {
      const quotations = await quotationRepository.getByField("purchaseRequestId", purchaseRequestId);

      await quotationRepository.fullFillSuppliers(quotations);

      setQuotations(quotations);
    } catch (error) {
      const err = error as Error;
      Swal.fire({
        icon: "error",
        title: "Erro ao carregar as cotações",
        html: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>Cotações da Requisição de Compra: "{purchaseRequestId}"</h2>
        {currentFirebaseUser?.isAdmin && (
          <Button variant="primary" onClick={() => showModal(CrudOperation.Create)}>
            <i className="bi bi-plus-square me-2" />
            Cadastrar
          </Button>
        )}
      </div>

      <QuotationModal
        crudOperation={crudOperation}
        quotation={quotation}
        updateTable={updateTable}
        visible={modalVisible}
        setVisible={setModalVisible}
        purchaseRequestId={purchaseRequestId}
      />
      {loading ? <Loading /> : <QuotationsTable quotations={quotations} showModal={showModal} />}
    </>
  );
}
