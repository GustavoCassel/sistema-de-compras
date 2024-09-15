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
  quotations: Quotation[] = [];
  status: PurchaseRequestStatus | undefined = undefined;
  observations?: string | undefined = "";
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
    for (const purchaseRequest of purchaseRequests) {
      await this.fullFillFirebaseUser(purchaseRequest);
    }
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

  async fullFillQuotationsSingle(purchaseRequest: PurchaseRequest): Promise<void> {
    const quotations = await quotationRepository.getByField("purchaseRequestId", purchaseRequest.id);

    purchaseRequest.quotations = quotations;
  }

  async fullFillQuotations(purchaseRequests: PurchaseRequest[]): Promise<void> {
    for (const purchaseRequest of purchaseRequests) {
      await this.fullFillQuotationsSingle(purchaseRequest);
    }
  }

  async fullFillStatusSingle(purchaseRequest: PurchaseRequest): Promise<void> {
    const quotationsCount = await quotationRepository.countByField("purchaseRequestId", purchaseRequest.id);

    if (quotationsCount === NUMBER_OF_QUOTES_REQUIRED) {
      purchaseRequest.status = PurchaseRequestStatus.Quoted;
    } else if (quotationsCount === 0) {
      purchaseRequest.status = PurchaseRequestStatus.Open;
    } else {
      purchaseRequest.status = PurchaseRequestStatus.Quoting;
    }
  }

  async fullFillStatus(purchaseRequests: PurchaseRequest[]): Promise<void> {
    for (const purchaseRequest of purchaseRequests) {
      await this.fullFillStatusSingle(purchaseRequest);
    }
  }
}

export const purchaseRequestRepository = new PurchaseRequestRepository();
