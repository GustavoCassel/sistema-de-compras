/*
Este arquivo deve conter as funções de acesso ao banco de dados para a entidade "Fornecedor".

nome (string) - Nome do fornecedor
ativo (boolean) - Indica se o fornecedor está ativo ou não (padrão: true)
bairro (string) - Nome do bairro
cidade (string) - Nome da cidade
estado (string) - Sigla do estado (ex: "SP") máximo de 2 caracteres
tipoPessoa (string) - Valores possíveis: "Física" ou "Jurídica"
*/

import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const fornecedoresCollection = collection(db, "fornecedores");

export async function inserirFornecedor(fornecedor) {
  const docRef = await addDoc(fornecedoresCollection, fornecedor);
  return docRef.id;
}

/*
export async function atualizarFornecedor(fornecedor) {
  const docRef = await updateDoc(getCollection(), fornecedor.id, fornecedor);
  return docRef.id;
}
*/

export async function apagarFornecedor(fornecedor) {
  await deleteDoc(doc(fornecedoresCollection, fornecedor.id));
}

export async function listarFornecedores() {
  const fornecedores = [];

  await getDocs(fornecedoresCollection)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const fornecedor = doc.data();
        fornecedor.id = doc.id;
        fornecedores.push(fornecedor);
      });
    })
    .catch((error) => {
      console.error("Erro ao listar fornecedores: ", error);
    });

  console.log(fornecedores);
  return fornecedores;
}
