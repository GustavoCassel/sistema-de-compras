// Endpoint
export const HOME_ENDPOINT: string = "/";
export const LOGIN_ENDPOINT: string = "/login";
export const NOT_FOUND_ENDPOINT: string = "*";
export const SUPPLIERS_ENDPOINT: string = "/suppliers";
export const CONTACTS_ENDPOINT: string = "/contacts";

// Masks
export const CNPJ_MASK: string = "99.999.999/9999-99";
export const CPF_MASK: string = "999.999.999-99";
export const CEP_MASK: string = "99999-999";

// Global enums
export enum CrudOperation {
  Create,
  Read,
  Update,
  Delete,
}

// Regular expressions (regex)
