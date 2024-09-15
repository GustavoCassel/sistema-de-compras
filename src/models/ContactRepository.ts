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

class ContactRepository extends FirebaseRepository<Contact> {
  constructor() {
    super("contacts");
  }

  async getAllActive(): Promise<Contact[]> {
    return this.getByField("active", true);
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
