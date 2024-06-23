import "./Layout.css";

import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout-container">
      <nav>
        <ul className="horizontal-menu">
          <li>
            <Link to={"/"}>Início</Link>
          </li>
          <li>
            <Link to={"/fornecedores"}>Fornecedores</Link>
          </li>
          <li>
            <Link to={"/contatos"}>Contatos</Link>
          </li>
          <li>
            <Link to={"/produtos"}>Produtos</Link>
          </li>
          <li>
            <Link to={"/cotacoes"}>Cotações</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}
