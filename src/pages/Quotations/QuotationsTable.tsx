import { useEffect, useState } from "react";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { CrudOperation, formatValue } from "../../data/constants";
import { Quotation } from "../../models/QuotationRepository";

export type QuotationsTableProps = {
  quotations: Quotation[];
  showModal: (crudOperation: CrudOperation, quotation?: Quotation) => void;
};

export default function QuotationsTable({ quotations, showModal }: QuotationsTableProps) {
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  useEffect(() => {
    const prices: number[] = quotations.map((q) => q.price);
    setMinPrice(Math.min(...prices));
    setMaxPrice(Math.max(...prices));
  }, [quotations]);

  function calculateRowColor(quotation: Quotation): string {
    if (quotation.price === minPrice) {
      return "lightgreen";
    }

    if (quotation.price === maxPrice) {
      return "lightcoral";
    }

    return "lightblue";
  }

  if (!quotations || quotations.length === 0) {
    return <p>Nenhuma cotação encontrada</p>;
  }

  return (
    <Table striped bordered hover size="sm" responsive>
      <thead>
        <tr>
          <th>Data da Cotação</th>
          <th>Fornecedor</th>
          <th>Preço</th>
          <th>Observações</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {quotations.map((quotation) => (
          <tr key={quotation.id} style={{ verticalAlign: "middle" }}>
            <td>{quotation.quotationDate}</td>
            <td>{quotation.supplier?.name}</td>
            <td
              style={{
                backgroundColor: calculateRowColor(quotation),
              }}
            >
              {formatValue(quotation.price)}
            </td>
            <td>{quotation.observations}</td>
            <td>
              <ButtonGroup>
                <Button variant="info" className="bi bi-info-square" title="Visualizar" onClick={() => showModal(CrudOperation.Read, quotation)} />
                <Button variant="warning" className="bi bi-pencil-square" title="Editar" onClick={() => showModal(CrudOperation.Update, quotation)} />
                <Button variant="danger" className="bi bi-trash" title="Excluir" onClick={() => showModal(CrudOperation.Delete, quotation)} />
              </ButtonGroup>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
