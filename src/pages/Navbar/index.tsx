import { signOut } from "firebase/auth";
import { useContext } from "react";
import { Badge } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, Outlet } from "react-router-dom";
import { FirebaseUserContext } from "../../App";
import { auth, isAdmin } from "../../context/FirebaseContext";
import { CONTACTS_ENDPOINT, HOME_ENDPOINT, SUPPLIERS_ENDPOINT } from "../../data/constants";
import "./styles.css";

export default function AppHeader() {
  const user = useContext(FirebaseUserContext);

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
          {user && (
            <>
              <Navbar.Text>
                Conectado como: <strong>{user.email}</strong>
              </Navbar.Text>
              <Badge bg={isAdmin(user) ? "danger" : "success"} className="ms-2">
                {isAdmin(user) ? "Admin" : "Usuário"}
              </Badge>
              <Nav.Link as={NavLink} to={HOME_ENDPOINT} onClick={handleSignOut} className="justify-content-end">
                <i className="bi bi-box-arrow-right me-2 ms-2" />
                Sair
              </Nav.Link>
            </>
          )}
        </Container>
      </Navbar>

      <Container className="mt-3">
        <Outlet />
      </Container>
    </>
  );
}
