import { FirebaseRepository } from "../context/FirebaseRepository";
import { Supplier, supplierRepository } from "./SupplierRepository";

export class Contact {
  id: string = "";
  name: string = "";
  email: string = "";
  phone: string = "";
  active: boolean = true;
  supplierId: string = "";
  supplier: Supplier | undefined;
}

export const SUPPLIER_ID_FIELD_NAME = "supplierId";
export const ACTIVE_FIELD_NAME = "active";

class ContactRepository extends FirebaseRepository<Contact> {
  constructor() {
    super("contacts");
  }

  async findActiveContacts(): Promise<Contact[]> {
    return this.getByField(ACTIVE_FIELD_NAME, true);
  }

  async findBySupplier(supplierId: string): Promise<Contact[]> {
    return this.getByField(SUPPLIER_ID_FIELD_NAME, supplierId);
  }

  async fullFillSupplier(contact: Contact): Promise<void> {
    const supplier = await supplierRepository.getById(contact.supplierId);

    if (!supplier) {
      return;
    }

    contact.supplier = supplier;
  }

  async fullFillSuppliers(contacts: Contact[]): Promise<void> {
    const supplierIds = contacts.map((contact) => contact.supplierId);
    const suppliers = await supplierRepository.getByIds(supplierIds);

    contacts.forEach((contact) => {
      contact.supplier = suppliers.find((supplier) => supplier.id === contact.supplierId);
    });
  }
}

export const contactRepository = new ContactRepository();
