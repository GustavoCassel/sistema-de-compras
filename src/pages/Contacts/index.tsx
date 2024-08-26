import { useEffect, useState } from "react";
import { Contact, contactRepository } from "../../models/ContactRepository";
import { CrudOperation } from "../../data/constants";
import Loading from "../../components/Loading";
import ContactsTable from "./ContactsTable";
import { Button } from "react-bootstrap";
import ContactModal from "./ContactModal";
import Swal from "sweetalert2";

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact | undefined>();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [crudOperation, setCrudOperation] = useState<CrudOperation>(CrudOperation.Create);

  useEffect(() => {
    updateTable();
  }, []);

  async function updateTable() {
    try {
      const contacts = await contactRepository.getAll();

      await contactRepository.fullFillSuppliers(contacts);

      setLoading(false);
      setContacts(contacts);
    } catch (error) {
      const err = error as Error;
      Swal.fire({
        icon: "error",
        title: "Erro ao carregar contatos",
        html: err.message,
      });
    }
  }

  function showModal(crudOperation: CrudOperation, contact?: Contact) {
    setModalVisible(true);
    setCrudOperation(crudOperation);
    setContact(contact);
  }

  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>Contatos</h2>
        <Button variant="primary" onClick={() => showModal(CrudOperation.Create)}>
          <i className="bi bi-plus-square me-2" />
          Cadastrar
        </Button>
      </div>
      <ContactModal visible={modalVisible} setVisible={setModalVisible} crudOperation={crudOperation} contact={contact} updateContactsTable={updateTable} />
      {loading ? <Loading /> : <ContactsTable contacts={contacts} showModal={showModal} />}
    </>
  );
}
