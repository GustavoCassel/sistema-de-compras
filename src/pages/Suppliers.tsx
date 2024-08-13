import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Supplier, SupplierRepository } from "../models/Supplier";
import { CREATE_SUPPLIER_ENDPOINT, EDIT_SUPPLIER_ENDPOINT } from "../constants";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    SupplierRepository.getAll().then((suppliers) => {
      setSuppliers(suppliers);
      setPending(false);
    });
  }, []);

  const columns = [
    {
      name: "Nome",
      selector: (supplier: Supplier) => supplier.name,
      sortable: true,
    },
    {
      name: "Tipo Pessoa",
      selector: (supplier: Supplier) => supplier.supplierType,
      sortable: true,
    },
    {
      name: "CPF/CNPJ",
      selector: (supplier: Supplier) => supplier.document,
      sortable: true,
    },
    {
      name: "Cidade",
      selector: (supplier: Supplier) => supplier.city,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (supplier: Supplier) => supplier.state,
      sortable: true,
    },
    {
      name: "Ações",
      cell: (supplier: Supplier) => (
        <>
          <Link to={`${EDIT_SUPPLIER_ENDPOINT}/${supplier.id}`}>
            <Button variant="primary">Editar</Button>
          </Link>

          <Button
            variant="danger"
            onClick={async () => {
              await handleClickApagarFornecedor(supplier);
            }}
          >
            Apagar
          </Button>
        </>
      ),
    },
  ];

  async function handleClickApagarFornecedor(supplier: Supplier) {
    Swal.fire({
      title: "Tem certeza?",
      text: `Essa ação não poderá ser desfeita!\n\nDeseja apagar o fornecedor ${supplier.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Sim, apagar!",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) {
        return;
      }

      try {
        await SupplierRepository.delete(supplier.id);
        setSuppliers(suppliers.filter((f) => f.id !== supplier.id));

        Swal.fire({
          title: "Deletado!",
          text: "O fornecedor foi apagado com sucesso.",
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          title: "Erro!",
          text: "Ocorreu um erro ao apagar o fornecedor.",
          icon: "error",
        });
      }
    });
  }

  return (
    <div>
      <h2>Fornecedores</h2>
      <Link to={CREATE_SUPPLIER_ENDPOINT}>
        <Button variant="primary">Cadastrar Fornecedor</Button>
      </Link>
      <DataTable columns={columns} data={suppliers} progressPending={pending} striped pagination paginationPerPage={10} highlightOnHover dense />
    </div>
  );
}
