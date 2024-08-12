import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../api/firebase";

export type SupplierType = "Física" | "Jurídica";

export const SUPPLIER_TYPES: SupplierType[] = ["Física", "Jurídica"];

export class Supplier {
  id: string = "";
  name: string = "";
  active: boolean = true;
  supplierType: SupplierType = "Física";
  document: string = "";
  city: string = "";
  state: string = "";
}

const suppliersCollection = collection(firestore, "suppliers");

export class SupplierRepository {
  static async create(supplier: Supplier): Promise<void> {
    await addDoc(suppliersCollection, { ...supplier });
  }

  static async getAll(): Promise<Supplier[]> {
    const querySnapshot = await getDocs(suppliersCollection);
    const suppliers: Supplier[] = [];

    querySnapshot.forEach((doc) => {
      const supplier = doc.data() as Supplier;
      supplier.id = doc.id;
      suppliers.push(supplier);
    });

    return suppliers;
  }

  static async update(id: string, supplier: Partial<Supplier>): Promise<void> {
    const docRef = doc(suppliersCollection, id);
    await updateDoc(docRef, { ...supplier });
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(suppliersCollection, id);
    await deleteDoc(docRef);
  }

  static async findById(id: string): Promise<Supplier> {
    const docRef = doc(suppliersCollection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Fornecedor não encontrado");
    }

    const supplier = docSnap.data() as Supplier;
    supplier.id = docSnap.id;
    return supplier;
  }
}
