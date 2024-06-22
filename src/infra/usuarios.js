import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export async function logarUsuario(email, senha) {
  let retorno = new Object();

  await signInWithEmailAndPassword(auth, email, senha)
    .then((credenciais) => {
      console.log(credenciais);
      retorno.credenciais = credenciais;
      salvarCredenciaisLocal(credenciais.user);
    })
    .catch((erro) => {
      console.error(erro);
      retorno.erro = "Usuário ou senha inválidos!";
    });

  return retorno;
}

export async function deslogarUsuario(auth) {
  await signOut(auth);
  window.localStorage.removeItem("user");
  window.location.reload();
}

export function usuarioJaLogado(navigate) {
  const user = getUser(); // Verifica se o usuário está logado

  // Se não estiver, redireciona para a página de login
  if (!user) {
    navigate("/login");
    return;
  }

  const route = window.location.pathname;

  // Se o usuário estiver logado e tentar acessar a página de login, redireciona para a home
  if (route === "/login") {
    navigate("/");
  }
}

async function salvarCredenciaisLocal(user) {
  const json = JSON.stringify(user);

  window.localStorage.setItem("user", json);
}

function getUser() {
  try {
    const user = window.localStorage.getItem("user");

    return JSON.parse(user);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function criarConta(email, senha) {
  let retorno = new Object();

  await createUserWithEmailAndPassword(auth, email, senha)
    .then((credenciais) => {
      console.log(credenciais);
      retorno.credenciais = credenciais;
    })
    .catch((erro) => {
      console.error(erro);
      retorno.erro = "Erro ao criar conta!";
    });

  return retorno;
}
