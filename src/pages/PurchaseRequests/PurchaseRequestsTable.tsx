import { Badge, Button, ButtonGroup, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CrudOperation, QUOTATIONS_ENDPOINT } from "../../data/constants";
import { FirebaseUser } from "../../models/FirebaseUserRepository";
import { PurchaseRequest, PurchaseRequestStatus } from "../../models/PurchaseRequestRepository";

export type PurchaseRequestsTableProps = {
  purchaseRequests: PurchaseRequest[];
  showRequester: boolean;
  firebaseUser: FirebaseUser | null;
  showModal: (crudOperation: CrudOperation, purchaseRequest?: PurchaseRequest) => void;
};

export default function PurchaseRequestsTable({ purchaseRequests, firebaseUser, showRequester, showModal }: PurchaseRequestsTableProps) {
  const navigate = useNavigate();

  function handleQuotationsClick(purchaseRequest: PurchaseRequest) {
    if (!firebaseUser?.isAdmin && purchaseRequest.status === PurchaseRequestStatus.Open) {
      Swal.fire({
        title: "Nenhuma cotação encontrada",
        text: "A solicitação de compra precisa ter alguma cotação para visualizar",
        icon: "info",
      });
      return;
    }

    navigate(`${QUOTATIONS_ENDPOINT}/${purchaseRequest.id}`);
  }

  function getBadgeColor(status: PurchaseRequestStatus | undefined) {
    if (!status) {
      return "secondary";
    }

    switch (status) {
      case PurchaseRequestStatus.Open:
        return "danger";
      case PurchaseRequestStatus.Quoting:
        return "warning";
      case PurchaseRequestStatus.Quoted:
        return "success";
      default:
        return "secondary";
    }
  }

  if (!firebaseUser) {
    return <p>Usuário não encontrado</p>;
  }

  if (!purchaseRequests || purchaseRequests.length === 0) {
    return <p>Nenhuma solicitação de compra encontrada</p>;
  }

  return (
    <Table striped bordered hover size="sm" responsive>
      <thead>
        <tr>
          <th>Data da Solicitação</th>
          {showRequester && <th>Solicitante</th>}
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
            {showRequester && <td>{purchaseRequest.requesterEmail}</td>}
            <td>{purchaseRequest.product?.name}</td>
            <td>
              {purchaseRequest.quantity} {purchaseRequest.product?.measurementUnit}
            </td>
            <td>
              <Badge bg={getBadgeColor(purchaseRequest.status)}>{purchaseRequest.status}</Badge>
            </td>
            <td>{purchaseRequest.observations}</td>
            <td>
              <ButtonGroup>
                <Button variant="info" className="bi bi-info-square" title="Visualizar" onClick={() => showModal(CrudOperation.Read, purchaseRequest)} />
                <Button variant="warning" className="bi bi-pencil-square" title="Editar" onClick={() => showModal(CrudOperation.Update, purchaseRequest)} />
                <Button variant="danger" className="bi bi-trash" title="Excluir" onClick={() => showModal(CrudOperation.Delete, purchaseRequest)} />
                <Button
                  variant="success"
                  className="bi bi-currency-dollar"
                  title="Cotações"
                  onClick={() => {
                    handleQuotationsClick(purchaseRequest);
                  }}
                />
              </ButtonGroup>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
