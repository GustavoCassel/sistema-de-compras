import { FirebaseRepository } from "./FirebaseRepository";

export class Contact {
  id: string = "";
  name: string = "";
  email: string = "";
  phone: string = "";
  active: boolean = true;
  supplierId: string = "";
}

export const ContactsRepository = new FirebaseRepository<Contact>("contacts");
