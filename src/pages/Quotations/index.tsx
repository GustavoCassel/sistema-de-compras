import { useContext, useEffect, useState } from "react";
import { CrudOperation } from "../../data/constants";
import QuotationModal from "./QuotationModal";
import { Quotation, quotationRepository } from "../../models/QuotationRepository";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import QuotationsTable from "./QuotationsTable";
import Loading from "../../components/Loading";
import Swal from "sweetalert2";
import { FirebaseUserContext } from "../../App";

export default function Quotations() {
  const [quotation, setSelectedQuotation] = useState<Quotation | undefined>();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [crudOperation, setCrudOperation] = useState<CrudOperation>(CrudOperation.Create);

  const currentFirebaseUser = useContext(FirebaseUserContext);

  const purchaseRequestId = useParams<{ id: string }>().id!;
  if (!purchaseRequestId) {
    throw new Error("ID da requisição de compra não informado");
  }

  function showModal(crudOperation: CrudOperation, quotation?: Quotation) {
    setModalVisible(true);
    setCrudOperation(crudOperation);
    setSelectedQuotation(quotation);
  }

  useEffect(() => {
    updateTable();
  }, [currentFirebaseUser]);

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
