import moment from "moment";
import { FirebaseRepository } from "../context/FirebaseRepository";
import { Supplier } from "./SupplierRepository";
import { PurchaseRequest } from "./PurchaseRequestRepository";

export class Quotation {
  id: string = "";
  purchaseRequestId: string = "";
  purchaseRequest: PurchaseRequest | undefined = undefined;
  supplierId: string = "";
  supplier: Supplier | undefined = undefined;
  quotationDate: string = moment().format("YYYY-MM-DD");
  price: number = 0;
  observations?: string = "";
}

class QuotationRepository extends FirebaseRepository<Quotation> {
  constructor() {
    super("quotations");
  }
}

export const quotationRepository = new QuotationRepository();
