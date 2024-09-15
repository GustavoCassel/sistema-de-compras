import { FirebaseRepository } from "../context/FirebaseRepository";

export enum SupplierType {
  Physical = "Física",
  Legal = "Jurídica",
}

export const SUPPLIER_TYPES: SupplierType[] = Object.values(SupplierType);

export class Supplier {
  id: string = "";
  name: string = "";
  active: boolean = true;
  supplierType: SupplierType = SupplierType.Physical;
  document: string = "";
  city: string = "";
  state: string = "";
  cep: string = "";
}

class SupplierRepository extends FirebaseRepository<Supplier> {
  constructor() {
    super("suppliers");
  }

  async getAllActive(): Promise<Supplier[]> {
    return this.getByField("active", true);
  }
}

export const supplierRepository = new SupplierRepository();
