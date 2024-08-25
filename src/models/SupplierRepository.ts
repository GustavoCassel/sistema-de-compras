import { FirebaseRepository } from "./FirebaseRepository";

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

export const SupplierRepository = new FirebaseRepository<Supplier>("suppliers");
