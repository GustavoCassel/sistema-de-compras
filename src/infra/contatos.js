import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../infra/firebase";

const EntityPath = "contatos";

export async function inserirContato(novoContato) {
  const docRef = await addDoc(collection(db, EntityPath), novoContato);
  return docRef.id;
}

export async function listarContatos() {
  const contatos = [];
  const querySnapshot = await getDocs(collection(db, EntityPath));
  querySnapshot.forEach((doc) => {
    contatos.push(doc.data());
  });
  return contatos;
}
