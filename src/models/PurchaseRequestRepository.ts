import moment from "moment";
import { FirebaseRepository } from "../context/FirebaseRepository";
import { FirebaseUser, firebaseUserRepository } from "./FirebaseUserRepository";
import { Product, productRepository } from "./ProductRepository";
import { Quotation, quotationRepository } from "./QuotationRepository";
import { DATE_FORMAT } from "../data/constants";

export enum PurchaseRequestStatus {
  Open = "Aberta",
  Quoting = "Em cotação",
  Quoted = "Cotada",
}

export const PURCHASE_REQUEST_STATUS: PurchaseRequestStatus[] = Object.values(PurchaseRequestStatus);
export const NUMBER_OF_QUOTES_REQUIRED = 3;

export class PurchaseRequest {
  id: string = "";
  requestDate: string = moment().format(DATE_FORMAT);
  requesterEmail: string = "";
  requester: FirebaseUser | undefined = undefined;
  productId: string = "";
  product: Product | undefined = undefined;
  quantity: number = 0;
  quotationIds: string[] = [];
  quotations: Quotation[] = [];
  status: PurchaseRequestStatus = getPurchaseRequestStatus(this);
  observations?: string | undefined = "";
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

  async fullFillFirebaseUser(purchaseRequest: PurchaseRequest): Promise<void> {
    const requester = await firebaseUserRepository.getUniqueByField("email", purchaseRequest.requesterEmail);

    if (!requester) {
      return;
    }

    purchaseRequest.requester = requester;
  }

  async fullFillFirebaseUsers(purchaseRequests: PurchaseRequest[]): Promise<void> {
    const requesterEmails = purchaseRequests.map((purchaseRequest) => purchaseRequest.requesterEmail);
    const requesters = await firebaseUserRepository.getManyByField("email", requesterEmails);

    purchaseRequests.forEach((purchaseRequest) => {
      purchaseRequest.requester = requesters.find((requester) => requester.email === purchaseRequest.requesterEmail);
    });
  }

  async fullFillProduct(purchaseRequest: PurchaseRequest): Promise<void> {
    const product = await productRepository.getById(purchaseRequest.productId);

    if (!product) {
      return;
    }

    purchaseRequest.product = product;
  }

  async fullFillProducts(purchaseRequests: PurchaseRequest[]): Promise<void> {
    const productIds = purchaseRequests.map((purchaseRequest) => purchaseRequest.productId);
    const products = await productRepository.getByIds(productIds);

    purchaseRequests.forEach((purchaseRequest) => {
      purchaseRequest.product = products.find((product) => product.id === purchaseRequest.productId);
    });
  }

  async fullFillQuotations(purchaseRequest: PurchaseRequest): Promise<void> {
    const quotations = await Promise.all(purchaseRequest.quotationIds.map((quotationId) => quotationRepository.getById(quotationId)));

    purchaseRequest.quotations = quotations.filter((quotation) => quotation !== null) as Quotation[];
  }
}

export const purchaseRequestRepository = new PurchaseRequestRepository();
