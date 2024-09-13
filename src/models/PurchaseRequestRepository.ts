import { Timestamp } from "firebase/firestore";
import { FirebaseRepository } from "../context/FirebaseRepository";
import moment from "moment";

export enum PurchaseRequestStatus {
  Open = "Aberta",
  Quoting = "Em cotação",
  Quoted = "Cotada",
}

export const PURCHASE_REQUEST_STATUS: PurchaseRequestStatus[] = Object.values(PurchaseRequestStatus);
export const NUMBER_OF_QUOTES_REQUIRED = 3;

export class PurchaseRequest {
  id: string = "";
  requestDate: string = moment().format("YYYY-MM-DD");
  requesterId: string = "";
  productId: string = "";
  quantity: number = 0;
  quotationIds: string[] = [];
  status: PurchaseRequestStatus = getPurchaseRequestStatus(this);
  approvalDate?: string = undefined;
  observations?: string = undefined;
}

function getPurchaseRequestStatus(purchaseRequest: PurchaseRequest): PurchaseRequestStatus {
  if (purchaseRequest.quotationIds.length === 0) {
    return PurchaseRequestStatus.Open;
  }

  if (purchaseRequest.quotationIds.length === NUMBER_OF_QUOTES_REQUIRED) {
    return PurchaseRequestStatus.Quoted;
  }

  return PurchaseRequestStatus.Quoting;
}

class PurchaseRequestRepository extends FirebaseRepository<PurchaseRequest> {
  constructor() {
    super("purchase-requests");
  }
}

export const purchaseRequestRepository = new PurchaseRequestRepository();
