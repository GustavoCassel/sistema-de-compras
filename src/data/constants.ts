// Endpoint
export const HOME_ENDPOINT: string = "/";
export const LOGIN_ENDPOINT: string = "/login-register";
export const NOT_FOUND_ENDPOINT: string = "*";
export const USERS_ENDPOINT: string = "/users";
export const SUPPLIERS_ENDPOINT: string = "/suppliers";
export const CONTACTS_ENDPOINT: string = "/contacts";
export const PRODUCTS_ENDPOINT: string = "/products";
export const QUOTATIONS_ENDPOINT: string = "/quotations";
export const PURCHASE_REQUESTS_ENDPOINT: string = "/purchase-requests";

// Masks
export const CNPJ_MASK: string = "99.999.999/9999-99";
export const CPF_MASK: string = "999.999.999-99";
export const CEP_MASK: string = "99999-999";
export const PHONE_MASK: string = "(99) 99999-9999";

// Global enums
export enum CrudOperation {
  Create,
  Read,
  Update,
  Delete,
}

// Regular expressions (regex)
