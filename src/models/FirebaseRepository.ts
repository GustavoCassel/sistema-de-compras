import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { firestore } from "../context/FirebaseContext";

type TFirestoreEntity = { id?: string };

export class FirebaseRepository<T extends TFirestoreEntity> {
  constructor(private collectionName: string) {}

  private collection = collection(firestore, this.collectionName);

  async create(item: T): Promise<void> {
    await addDoc(this.collection, Object.assign({}, item));
  }

  async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(this.collection);
    const items: T[] = [];

    querySnapshot.forEach((doc) => {
      const item = doc.data() as T;
      item.id = doc.id;
      items.push(item);
    });

    return items;
  }

  async update(id: string, item: Partial<T>): Promise<void> {
    const docRef = doc(this.collection, id);

    const entries = Object.entries(item).filter(([_, value]) => value !== undefined);
    const updatedItem = Object.fromEntries(entries);

    if (Object.keys(updatedItem).length === 0) {
      return;
    }

    await updateDoc(docRef, updatedItem);
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.collection, id);
    await deleteDoc(docRef);
  }

  async findById(id: string): Promise<T> {
    const docRef = doc(this.collection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Item não encontrado");
    }

    const item = docSnap.data() as T;
    item.id = docSnap.id;

    return item;
  }
}
