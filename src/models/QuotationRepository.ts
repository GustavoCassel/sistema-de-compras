import { FirebaseRepository } from "./FirebaseRepository";

export class Quotation {
  id: string = "";
  supplierId: string = "";
  quotationDate: Date = new Date();
  validityDate: Date = new Date();
  totalAmount: number = 0;
  status: "Pending" | "Accepted" | "Rejected" = "Pending";
  observations?: string = "";
}

class QuotationRepository extends FirebaseRepository<Quotation> {
  constructor() {
    super("quotations");
  }
}

export const quotationRepository = new QuotationRepository();
