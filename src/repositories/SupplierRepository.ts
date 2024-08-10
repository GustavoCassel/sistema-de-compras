import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { firestore } from "../api/firebase";
import { Supplier } from "../models/Supplier";

const suppliersCollection = collection(firestore, "suppliers");

export class SupplierRepository {
  static async addSupplier(supplier: Supplier): Promise<string> {
    const docRef = await addDoc(suppliersCollection, supplier);
    return docRef.id;
  }

  static async getSuppliers(): Promise<Supplier[]> {
    const querySnapshot = await getDocs(suppliersCollection);
    const suppliers: Supplier[] = [];

    querySnapshot.forEach((doc) => {
      const supplier = doc.data() as Supplier;
      supplier.id = doc.id;
      suppliers.push(supplier);
    });

    return suppliers;
  }

  static async updateSupplier(id: string, supplier: Partial<Supplier>): Promise<void> {
    const supplierDoc = doc(suppliersCollection, id);
    await updateDoc(supplierDoc, supplier);
  }

  static async deleteSupplier(id: string): Promise<void> {
    const supplierDoc = doc(suppliersCollection, id);
    await deleteDoc(supplierDoc);
  }

  static async searchSuppliersById(id: string): Promise<Supplier> {
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
