import moment from "moment";
import { FirebaseRepository } from "../context/FirebaseRepository";
import { DATE_FORMAT } from "../data/constants";
import { Supplier, supplierRepository } from "./SupplierRepository";

export class Quotation {
  id: string = "";
  purchaseRequestId: string = "";
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

  async fullFillSuppliers(quotations: Quotation[]): Promise<void> {
    const suppliersIds = quotations.map((quotations) => quotations.supplierId);
    const suppliers = await supplierRepository.getByIds(suppliersIds);

    quotations.forEach((quotation) => {
      quotation.supplier = suppliers.find((supplier) => supplier.id === quotation.supplierId);
    });
  }
}

export const quotationRepository = new QuotationRepository();
