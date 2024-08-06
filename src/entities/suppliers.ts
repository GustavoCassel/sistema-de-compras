import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { firestore } from "../model/firebase";

import { SUPPLIERS_COLLECTION_PATH } from "../model/constants";

type SupplierType = "Física" | "Jurídica";

type Supplier = {
  id: string;
  name: string;
  active: boolean;
  neighborhood: string;
  city: string;
  state: string;
  personType: SupplierType;
};

export const suppliersCollection = collection(firestore, SUPPLIERS_COLLECTION_PATH);

export async function inserirFornecedor(supplier: Supplier): Promise<void> {
  await addDoc(suppliersCollection, supplier);
}

export async function atualizarFornecedor(supplier: Supplier): Promise<void> {
  const docRef = doc(suppliersCollection, supplier.id);
  await updateDoc(docRef, supplier);
}

export async function apagarFornecedor(supplier: Supplier): Promise<void> {
  await deleteDoc(doc(suppliersCollection, supplier.id));
}

export async function buscarFornecedorPorId(id: string): Promise<Supplier> {
  const docRef = doc(suppliersCollection, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Fornecedor não encontrado");
  }

  const supplier = docSnap.data() as Supplier;
  supplier.id = docSnap.id;
  return supplier;
}

export async function listarTodosOsFornecedores(): Promise<Supplier[]> {
  const fornecedores: Supplier[] = [];

  await getDocs(suppliersCollection)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const fornecedor = doc.data() as Supplier;
        fornecedor.id = doc.id;
        fornecedores.push(fornecedor);
      });
    })
    .catch((error) => {
      console.error("Erro ao listar fornecedores: ", error);
    });

  return fornecedores;
}
