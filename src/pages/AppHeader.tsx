import "./AppHeader.css";

import { Outlet, NavLink } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { SUPPLIERS_ENDPOINT } from "../constants";

export default function AppHeader() {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={NavLink} to={"/"}>
            Sistema de Compras
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to={SUPPLIERS_ENDPOINT}>
                Fornecedores
              </Nav.Link>
              <Nav.Link as={NavLink} to={"/contatos"}>
                Contatos
              </Nav.Link>
              <Nav.Link as={NavLink} to={"/produtos"}>
                Produtos
              </Nav.Link>
              <Nav.Link as={NavLink} to={"/cotacoes"}>
                Cotações
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
}
