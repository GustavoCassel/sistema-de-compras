import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button, ExportCsvButton, Loading } from "../../components";
import { CrudOperation } from "../../data/constants";
import { Product, productRepository } from "../../models/ProductRepository";
import ProductModal from "./ProductModal";
import ProductsTable from "./ProductsTable";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [crudOperation, setCrudOperation] = useState<CrudOperation>(CrudOperation.Create);

  useEffect(() => {
    updateTable();
  }, []);

  async function updateTable() {
    setLoading(true);
    try {
      const products = await productRepository.getAll();

      setProducts(products);
    } catch (error) {
      const err = error as Error;
      Swal.fire({
        icon: "error",
        title: "Erro ao carregar contatos",
        html: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  function showModal(crudOperation: CrudOperation, product?: Product) {
    setModalVisible(true);
    setCrudOperation(crudOperation);
    setProduct(product);
  }

  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>Produtos</h2>
        <Button onClick={() => showModal(CrudOperation.Create)}>
          <i className="bi bi-plus-square me-2" />
          Cadastrar
        </Button>
      </div>
      <ProductModal visible={modalVisible} setVisible={setModalVisible} crudOperation={crudOperation} product={product} updateTable={updateTable} />
      {loading ? <Loading /> : <ProductsTable products={products} showModal={showModal} />}
      {products.length !== 0 && <ExportCsvButton data={products} filename="produtos.csv" />}
    </>
  );
}
