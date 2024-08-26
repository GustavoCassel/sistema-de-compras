import { FirebaseRepository } from "../context/FirebaseRepository";

export enum MeasurementUnit {
  Unit = "UN (Unidade)",
  T = "T (Tonelada)",
  Kg = "KG (Quilograma)",
  Lt = "L (Litro)",
  Ml = "ML (Mililitro)",
  Cm = "CM (Centímetro)",
  M = "M (Metro linear)",
  M2 = "M² (Metro quadrado)",
  M3 = "M³ (Metro cúbico)",
  Cx = "CX (Caixa)",
  Dz = "DZ (Dúzia)",
  Mi = "MI (Milheiro)",
}

export const MEASUREMENT_UNITS: MeasurementUnit[] = Object.values(MeasurementUnit);

export class Product {
  id: string = "";
  name: string = "";
  description: string = "";
  observations: string = "";
  active: boolean = true;
  measurementUnit: MeasurementUnit = MeasurementUnit.Unit;
}

class ProductRepository extends FirebaseRepository<Product> {
  constructor() {
    super("products");
  }
}

export const productRepository = new ProductRepository();
