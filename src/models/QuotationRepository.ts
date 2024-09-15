import moment from "moment";
import { FirebaseRepository } from "../context/FirebaseRepository";
import { Supplier } from "./SupplierRepository";
import { PurchaseRequest } from "./PurchaseRequestRepository";
import { DATE_FORMAT } from "../data/constants";

export class Quotation {
  id: string = "";
  purchaseRequestId: string = "";
  purchaseRequest: PurchaseRequest | undefined = undefined;
  supplierId: string = "";
  supplier: Supplier | undefined = undefined;
  quotationDate: string = moment().format(DATE_FORMAT);
  price: number = 0;
  observations?: string | undefined = "";
}

class QuotationRepository extends FirebaseRepository<Quotation> {
  constructor() {
    super("quotations");
  }
}

export const quotationRepository = new QuotationRepository();
