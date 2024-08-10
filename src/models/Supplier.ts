type SupplierType = "Física" | "Jurídica";

export interface Supplier {
  id: string;
  name: string;
  active: boolean;
  neighborhood: string;
  city: string;
  state: string;
  personType: SupplierType;
}
