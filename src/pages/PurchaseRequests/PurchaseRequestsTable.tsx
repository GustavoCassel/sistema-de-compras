import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
import activeImg from "../../assets/green_square.png";
import inactiveImg from "../../assets/red_square.png";
import { CrudOperation } from "../../data/constants";
import { PurchaseRequest } from "../../models/PurchaseRequestRepository";

export type PurchaseRequestsTableProps = {
  purchaseRequests: PurchaseRequest[];
  showModal: (crudOperation: CrudOperation, purchaseRequest?: PurchaseRequest) => void;
};

export default function PurchaseRequestsTable({ purchaseRequests, showModal }: PurchaseRequestsTableProps) {
  if (!purchaseRequests || purchaseRequests.length === 0) {
    return <p>Nenhuma solicitação de compra encontrada</p>;
  }

  return (
    <Table striped bordered hover size="sm" responsive>
      <thead>
        <tr>
          <th>Data da Solicitação</th>
          <th>Solicitante</th>
          <th>Produto</th>
          <th>Quantidade</th>
          <th>Status</th>
          <th>Data da Aprovação</th>
          <th>Observações</th>
        </tr>
      </thead>
      <tbody>
        {purchaseRequests.map((purchaseRequest) => (
          <tr key={purchaseRequest.id}>
            <td>{purchaseRequest.requestDate}</td>
            <td>{purchaseRequest.requesterId}</td>
            <td>{purchaseRequest.productId}</td>
            <td>{purchaseRequest.quantity}</td>
            <td>{purchaseRequest.status}</td>
            <td>{purchaseRequest.approvalDate}</td>
            <td>{purchaseRequest.observations}</td>
            <td>
              <ButtonGroup>
                <Button variant="info" className="bi bi-info-square" title="Visualizar" onClick={() => showModal(CrudOperation.Read, purchaseRequest)} />
                <Button variant="warning" className="bi bi-pencil-square" title="Editar" onClick={() => showModal(CrudOperation.Update, purchaseRequest)} />
                <Button variant="danger" className="bi bi-trash" title="Excluir" onClick={() => showModal(CrudOperation.Delete, purchaseRequest)} />
              </ButtonGroup>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
