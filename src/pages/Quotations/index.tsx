import { useState } from "react";
import { CrudOperation } from "../../data/constants";
import QuotationModal from "./QuotationModal";
import { Quotation } from "../../models/QuotationRepository";
import { Button } from "react-bootstrap";

export default function Quotations() {
  const [quotation, setSelectedQuotation] = useState<Quotation | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  const [crudOperation, setCrudOperation] = useState<CrudOperation>(CrudOperation.Create);

  function showModal(crudOperation: CrudOperation, quotation?: Quotation) {
    setModalVisible(true);
    setCrudOperation(crudOperation);
    setSelectedQuotation(quotation);
  }

  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>Cotações</h2>
        <Button variant="primary" onClick={() => showModal(CrudOperation.Create)}>
          <i className="bi bi-plus-square me-2" />
          Cadastrar
        </Button>
      </div>

      <QuotationModal crudOperation={crudOperation} quotation={quotation} updateTable={() => {}} visible={modalVisible} setVisible={setModalVisible} />
    </>
  );
}
