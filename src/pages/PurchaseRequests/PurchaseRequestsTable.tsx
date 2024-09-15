import { Badge } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
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
          <th>Observações</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {purchaseRequests.map((purchaseRequest) => (
          <tr key={purchaseRequest.id}>
            <td>{purchaseRequest.requestDate}</td>
            <td>{purchaseRequest.requesterEmail}</td>
            <td>{purchaseRequest.product?.name}</td>
            <td>{purchaseRequest.quantity}</td>
            <td>
              <Badge bg={purchaseRequest.status === "Aberta" ? "danger" : purchaseRequest.status === "Em cotação" ? "warning" : "success"}>
                {purchaseRequest.status}
              </Badge>
            </td>
            <td>{purchaseRequest.observations}</td>
            <td>
              <ButtonGroup>
                <Button variant="info" className="bi bi-info-square" title="Visualizar" onClick={() => showModal(CrudOperation.Read, purchaseRequest)} />
                <Button variant="warning" className="bi bi-pencil-square" title="Editar" onClick={() => showModal(CrudOperation.Update, purchaseRequest)} />
                <Button variant="danger" className="bi bi-trash" title="Excluir" onClick={() => showModal(CrudOperation.Delete, purchaseRequest)} />
                <Button variant="success" className="bi bi-currency-dollar" title="Cotações" onClick={() => {}} />
              </ButtonGroup>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
