import { useEffect, useState } from "react";
import activeImg from "../../assets/green_square.png";
import inactiveImg from "../../assets/red_square.png";
import { Loading, Table } from "../../components";
import { Contact, contactRepository } from "../../models/ContactRepository";
import { Supplier } from "../../models/SupplierRepository";

export type SupplierContactsTableProps = {
  supplier: Supplier;
};

export default function SupplierContactsTable({ supplier }: SupplierContactsTableProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadContacts() {
    const contacts = await contactRepository.getByField("supplierId", supplier.id);
    setContacts(contacts);
    setLoading(false);
  }

  useEffect(() => {
    loadContacts();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <Table>
      <thead>
        <tr>
          <th>Ativo</th>
          <th>Nome</th>
          <th>Telefone</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {contacts.length === 0 ? (
          <tr>
            <td colSpan={4}>Nenhum contato encontrado</td>
          </tr>
        ) : (
          contacts.map((contact) => (
            <tr key={contact.id} style={{ verticalAlign: "middle" }}>
              <td>
                <img src={contact.active ? activeImg : inactiveImg} alt={contact.active ? "Ativo" : "Inativo"} width="20" height="20" />
              </td>
              <td>{contact.name}</td>
              <td>{contact.phone}</td>
              <td>{contact.email}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}
