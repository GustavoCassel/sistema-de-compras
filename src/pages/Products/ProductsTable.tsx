import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
import activeImg from "../../assets/green_square.png";
import inactiveImg from "../../assets/red_square.png";
import { CrudOperation } from "../../data/constants";
import { Product } from "../../models/ProductRepository";

export type ProductsTableProps = {
  products: Product[];
  showModal: (crudOperation: CrudOperation, product?: Product) => void;
};

export default function ProductsTable({ products, showModal }: ProductsTableProps) {
  if (!products || products.length === 0) {
    return <p>Nenhum produto encontrado</p>;
  }

  return (
    <Table striped bordered hover size="sm" responsive>
      <thead>
        <tr>
          <th>Status</th>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Unidade de Medida</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>
              <img src={product.active ? activeImg : inactiveImg} alt={product.active ? "Ativo" : "Inativo"} width="20" height="20" className="me-2" />
              {product.active ? "Ativo" : "Inativo"}
            </td>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>{product.measurementUnit}</td>
            <td>
              <ButtonGroup>
                <Button variant="info" className="bi bi-info-square" title="Visualizar" onClick={() => showModal(CrudOperation.Read, product)} />
                <Button variant="warning" className="bi bi-pencil-square" title="Editar" onClick={() => showModal(CrudOperation.Update, product)} />
                <Button variant="danger" className="bi bi-trash" title="Excluir" onClick={() => showModal(CrudOperation.Delete, product)} />
              </ButtonGroup>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
