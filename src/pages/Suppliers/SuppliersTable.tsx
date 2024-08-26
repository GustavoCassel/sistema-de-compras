import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
import activeImg from "../../assets/green_square.png";
import inactiveImg from "../../assets/red_square.png";
import { CrudOperation } from "../../data/constants";
import { Supplier } from "../../models/SupplierRepository";

export type SuppliersTableProps = {
  suppliers: Supplier[];
  showModal: (crudOperation: CrudOperation, supplier?: Supplier) => void;
};

export default function SuppliersTable({ suppliers, showModal }: SuppliersTableProps) {
  if (!suppliers || suppliers.length === 0) {
    return <p>Nenhum fornecedor encontrado</p>;
  }

  return (
    <Table striped bordered hover size="sm" responsive>
      <thead>
        <tr>
          <th>Status</th>
          <th>Nome</th>
          <th>Tipo Pessoa</th>
          <th>CPF/CNPJ</th>
          <th>Cidade</th>
          <th>Estado</th>
          <th>CEP</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((supplier) => (
          <tr key={supplier.id}>
            <td>
              <img src={supplier.active ? activeImg : inactiveImg} alt={supplier.active ? "Ativo" : "Inativo"} width="20" height="20" className="me-2" />
              {supplier.active ? "Ativo" : "Inativo"}
            </td>
            <td>{supplier.name}</td>
            <td>{supplier.supplierType}</td>
            <td>{supplier.document}</td>
            <td>{supplier.city}</td>
            <td>{supplier.state}</td>
            <td>{supplier.cep}</td>
            <td>
              <ButtonGroup>
                <Button variant="info" className="bi bi-info-square" title="Visualizar" onClick={() => showModal(CrudOperation.Read, supplier)} />
                <Button variant="warning" className="bi bi-pencil-square" title="Editar" onClick={() => showModal(CrudOperation.Update, supplier)} />
                <Button variant="danger" className="bi bi-trash" title="Excluir" onClick={() => showModal(CrudOperation.Delete, supplier)} />
              </ButtonGroup>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
