export class CepAddress {
  cep: string = "";
  logradouro: string = "";
  complemento: string = "";
  unidade: string = "";
  bairro: string = "";
  localidade: string = "";
  uf: string = "";
  estado: string = "";
  regiao: string = "";
  ibge: string = "";
  gia: string = "";
  ddd: string = "";
  siafi: string = "";
}

const API_URL = "https://viacep.com.br/ws";

class ViaCepService {
  static async getAddress(cep: string): Promise<CepAddress> {
    const response = await fetch(`${API_URL}/${cep}/json`);

    const data = await response.json();

    if (data.erro) {
      throw new Error("CEP não encontrado");
    }

    return data as CepAddress;
  }
}

export default ViaCepService;
