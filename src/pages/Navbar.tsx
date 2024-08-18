import { signOut } from "firebase/auth";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, Outlet } from "react-router-dom";
import { auth } from "../context/FirebaseContext";
import { HOME_ENDPOINT, SUPPLIERS_ENDPOINT } from "../data/constants";
import "./Navbar.css";

export default function AppHeader() {
  function handleSignOut() {
    signOut(auth);
    window.location.reload();
  }

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={NavLink} to={HOME_ENDPOINT}>
            Sistema de Compras
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
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
            {auth.currentUser && (
              <Nav>
                <Nav.Link as={NavLink} to={HOME_ENDPOINT} onClick={handleSignOut}>
                  Sair
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
}
