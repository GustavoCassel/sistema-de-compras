import { FirebaseOptions, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, UserCredential } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { NavigateFunction } from "react-router-dom";
import { HOME_ENDPOINT, LOGIN_ENDPOINT, USER_CREDENTIAL_LOCAL_KEY } from "../constants";

const firebaseOptions = getFirebaseOptions();

export const app = initializeApp(firebaseOptions);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

export async function loginAndSaveSession(email: string, password: string): Promise<UserCredential> {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  saveLocalCredentials(credentials);
  return credentials;
}

export async function createUserAndSaveSession(email: string, password: string): Promise<UserCredential> {
  const credentials = await createUserWithEmailAndPassword(auth, email, password);
  saveLocalCredentials(credentials);
  return credentials;
}

export async function signOutAndRemoveSession() {
  await signOut(auth);
  removeLocalCredentials();
  window.location.reload();
}

export function navigateByLoginState(navigate: NavigateFunction) {
  const user = getLocalCredentials();

  if (!user) {
    navigate(LOGIN_ENDPOINT);
    return;
  }

  const route = window.location.pathname;

  // if the user is already logged in, redirect to home if the user tries to access the login page
  if (route === LOGIN_ENDPOINT) {
    navigate(HOME_ENDPOINT);
  }
}

function saveLocalCredentials(user: UserCredential) {
  const json = JSON.stringify(user);

  window.localStorage.setItem(USER_CREDENTIAL_LOCAL_KEY, json);
}

function getLocalCredentials(): UserCredential | null {
  const user = window.localStorage.getItem(USER_CREDENTIAL_LOCAL_KEY);

  if (!user) {
    return null;
  }

  return JSON.parse(user) as UserCredential;
}

function removeLocalCredentials() {
  window.localStorage.removeItem(USER_CREDENTIAL_LOCAL_KEY);
}

function getFirebaseOptions(): FirebaseOptions {
  const apiKey = process.env.REACT_APP_API_KEY;
  if (!apiKey) {
    throw new Error("Variável de ambiente REACT_APP_API_KEY não definida");
  }

  const authDomain = process.env.REACT_APP_AUTH_DOMAIN;
  if (!authDomain) {
    throw new Error("Variável de ambiente REACT_APP_AUTH_DOMAIN não definida");
  }

  const projectId = process.env.REACT_APP_PROJECT_ID;
  if (!projectId) {
    throw new Error("Variável de ambiente REACT_APP_PROJECT_ID não definida");
  }

  const storageBucket = process.env.REACT_APP_STORAGE_BUCKET;
  if (!storageBucket) {
    throw new Error("Variável de ambiente REACT_APP_STORAGE_BUCKET não definida");
  }

  const messagingSenderId = process.env.REACT_APP_MESSAGING_SENDER_ID;
  if (!messagingSenderId) {
    throw new Error("Variável de ambiente REACT_APP_MESSAGING_SENDER_ID não definida");
  }

  const appId = process.env.REACT_APP_APP_ID;
  if (!appId) {
    throw new Error("Variável de ambiente REACT_APP_APP_ID não definida");
  }

  const firebaseOptions: FirebaseOptions = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
  };

  return firebaseOptions;
}
