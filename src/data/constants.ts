import { formatValue as formatter } from "react-currency-input-field";
import { IntlConfig } from "react-currency-input-field/dist/components/CurrencyInputProps";

// Endpoints
export const HOME_ENDPOINT: string = "/";
export const LOGIN_ENDPOINT: string = "/login-register";
export const LOGOUT_ENDPOINT: string = "/logout";
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

// Date formats
export const DATE_FORMAT: string = "DD/MM/YYYY HH:mm";

// Global enums
export enum CrudOperation {
  Create,
  Read,
  Update,
  Delete,
}

// Regular expressions (regex)
export const CEP_REGEX: RegExp = /^\d{5}-\d{3}$/;
export const CPF_REGEX: RegExp = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
export const CNPJ_REGEX: RegExp = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

// Currency
export const APP_CURRENCY_LOCALE_FORMAT: IntlConfig = {
  locale: "pt-BR",
  currency: "BRL",
};

// Value Formaters
export const formatValue = (value: number) => {
  const options = {
    value: value.toString(),
    intlConfig: APP_CURRENCY_LOCALE_FORMAT,
    decimalScale: 2,
  };
  return formatter(options);
};
