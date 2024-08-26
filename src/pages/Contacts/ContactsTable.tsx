import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
import activeImg from "../../assets/green_square.png";
import inactiveImg from "../../assets/red_square.png";
import Loading from "../../components/Loading";
import { Contact, contactRepository } from "../../models/ContactRepository";
import { Supplier } from "../../models/SupplierRepository";
import { CrudOperation } from "../../data/constants";

export type ContactsTableProps = {
  contacts: Contact[];
  showModal: (crudOperation: CrudOperation, contact?: Contact) => void;
};

export default function ContactsTable({ contacts, showModal }: ContactsTableProps) {
  if (!contacts || contacts.length === 0) {
    return <p>Nenhum contato encontrado</p>;
  }

  return (
    <Table striped bordered hover size="sm" responsive>
      <thead>
        <tr>
          <th>Status</th>
          <th>Nome</th>
          <th>Fornecedor</th>
          <th>Telefone</th>
          <th>Email</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact) => (
          <tr key={contact.id}>
            <td>
              <img src={contact.active ? activeImg : inactiveImg} alt={contact.active ? "Ativo" : "Inativo"} width="20" height="20" className="me-2" />
              {contact.active ? "Ativo" : "Inativo"}
            </td>
            <td>{contact.name}</td>
            <td>{"dps vai ter o fornecedor aqui"}</td>
            <td>{contact.phone}</td>
            <td>{contact.email}</td>
            <td>
              <ButtonGroup>
                <Button variant="info" className="bi bi-info-square" title="Visualizar" onClick={() => showModal(CrudOperation.Read, contact)} />
                <Button variant="warning" className="bi bi-pencil-square" title="Editar" onClick={() => showModal(CrudOperation.Update, contact)} />
                <Button variant="danger" className="bi bi-trash" title="Excluir" onClick={() => showModal(CrudOperation.Delete, contact)} />
              </ButtonGroup>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
