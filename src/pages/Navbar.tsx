import { signOut } from "firebase/auth";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { auth, isAdmin } from "../context/FirebaseContext";
import { CONTACTS_ENDPOINT, HOME_ENDPOINT, SUPPLIERS_ENDPOINT } from "../data/constants";
import "./Navbar.css";
import { Badge } from "react-bootstrap";

export default function AppHeader() {
  function handleSignOut() {
    signOut(auth);
    window.location.reload();
  }

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" variant="tabs">
        <Container>
          <Navbar.Brand as={NavLink} to={HOME_ENDPOINT}>
            <i className="bi bi-cart3 me-2" />
            Sistema de Compras
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to={SUPPLIERS_ENDPOINT}>
                <i className="bi bi-truck me-2" />
                Fornecedores
              </Nav.Link>
              <Nav.Link as={NavLink} to={CONTACTS_ENDPOINT}>
                <i className="bi bi-person me-2" />
                Contatos
              </Nav.Link>
              <Nav.Link as={NavLink} to={"/produtos"}>
                <i className="bi bi-box me-2" />
                Produtos
              </Nav.Link>
              <Nav.Link as={NavLink} to={"/cotacoes"}>
                <i className="bi bi-currency-dollar me-2" />
                Cotações
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          {auth.currentUser && (
            <>
              <Navbar.Text>
                Conectado como: <strong>{auth.currentUser.email}</strong>
              </Navbar.Text>
              <Badge bg={isAdmin() ? "danger" : "success"} className="ms-2">
                {isAdmin() ? "Admin" : "Usuário"}
              </Badge>
              <Nav.Link as={NavLink} to={HOME_ENDPOINT} onClick={handleSignOut} className="justify-content-end">
                <i className="bi bi-box-arrow-right me-2 ms-2" />
                Sair
              </Nav.Link>
            </>
          )}
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
}
