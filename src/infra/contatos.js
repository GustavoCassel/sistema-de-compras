/*
Este arquivo deve conter as funções de acesso ao banco de dados para a entidade "Contato".

id (string) - ID do contato (gerado automaticamente)
nome (string) - Nome do contato
email (string) - E-mail do contato
telefone (string) - Telefone do contato
fornecedor (string) - ID do fornecedor associado ao contato
ativo (boolean) - Indica se o contato está ativo ou não (padrão: true)
*/

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const contatosCollection = collection(db, "contatos");

export async function inserirContato(contato) {
  const docRef = await addDoc(contatosCollection, contato);
  return docRef.id;
}

export async function atualizarContato(contato) {
  const docRef = doc(contatosCollection, contato.id);
  await updateDoc(docRef, contato);
}

export async function apagarContato(contato) {
  await deleteDoc(doc(contatosCollection, contato.id));
}

export async function buscarContato(id) {
  const docRef = doc(contatosCollection, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export async function listarContatos() {
  const contatos = [];

  await getDocs(contatosCollection)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const contato = doc.data();
        contato.id = doc.id;
        contatos.push(contato);
      });
    })
    .catch((error) => {
      console.error("Erro ao listar contatos: ", error);
    });

  return contatos;
}
