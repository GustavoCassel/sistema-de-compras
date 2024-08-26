import { FirebaseRepository } from "./FirebaseRepository";

export enum PurchaseRequestStatus {
  Open = "Aberta",
  Quoting = "Em cotação",
  Quoted = "Cotada",
}

export const PURCHASE_REQUEST_STATUS: PurchaseRequestStatus[] = Object.values(PurchaseRequestStatus);
export const NUMBER_OF_QUOTES_REQUIRED = 3;

export class PurchaseRequest {
  id: string = "";
  requestDate: Date = new Date();
  requesterUid: string = "";
  productsId: string = "";
  quotationIds: string[] = [];
  status: PurchaseRequestStatus = getPurchaseRequestStatus(this);
  approvalDate?: Date = undefined;
  remarks?: string = undefined;
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
