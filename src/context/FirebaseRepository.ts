import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "../context/FirebaseContext";

type TFirestoreEntity = { id?: string };

export abstract class FirebaseRepository<T extends TFirestoreEntity> {
  constructor(private collectionName: string) {}

  private collection = collection(firestore, this.collectionName);

  async create(item: T): Promise<void> {
    await addDoc(this.collection, Object.assign({}, item));
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

  async getById(id: string): Promise<T | null> {
    const docRef = doc(this.collection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const item = docSnap.data() as T;
    item.id = docSnap.id;

    return item;
  }

  async getByIds(ids: string[]): Promise<T[]> {
    const items: T[] = [];

    for (const id of ids) {
      const item = await this.getById(id);

      if (item) {
        items.push(item);
      }
    }

    return items;
  }

  async getByField<K extends keyof T>(fieldName: K, fieldValue: T[K]): Promise<T[]> {
    const q = query(this.collection, where(fieldName as string, "==", fieldValue));
    const querySnapshot = await getDocs(q);
    const items: T[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as T;
      data.id = doc.id;

      items.push(data);
    });

    return items;
  }

  async getUniqueByField<K extends keyof T>(fieldName: K, fieldValue: T[K]): Promise<T | null> {
    const items = await this.getByField(fieldName, fieldValue);

    if (items.length > 1) {
      throw new Error(`Mais de um item com o mesmo ${fieldName as string}.`);
    }

    if (!items) {
      return null;
    }

    return items[0];
  }

  async countByField<K extends keyof T>(fieldName: K, fieldValue: T[K]): Promise<number> {
    const q = query(this.collection, where(fieldName as string, "==", fieldValue));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }
}
