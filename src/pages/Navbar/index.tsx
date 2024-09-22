import { signOut } from "firebase/auth";
import { useContext } from "react";
import { Badge, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import { FirebaseUserContext } from "../../App";
import { auth } from "../../context/FirebaseContext";
import { CONTACTS_ENDPOINT, HOME_ENDPOINT, PRODUCTS_ENDPOINT, PURCHASE_REQUESTS_ENDPOINT, SUPPLIERS_ENDPOINT, USERS_ENDPOINT } from "../../data/constants";
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
          {user && (
            <>
              {user.isAdmin ? <AdminNavbar /> : <UserNavbar />}
              <Navbar>
                <Navbar.Text>
                  Conectado como: <strong>{user.email}</strong>
                </Navbar.Text>
                <Badge bg={user.isAdmin ? "danger" : "success"} className="ms-2">
                  {user.isAdmin ? "Admin" : "Usuário"}
                </Badge>
                <Nav.Link as={NavLink} to={HOME_ENDPOINT} onClick={handleSignOut} className="justify-content-end">
                  <i className="bi bi-box-arrow-right me-2 ms-2" />
                  Sair
                </Nav.Link>
              </Navbar>
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

function UserNavbar() {
  return (
    <Nav className="me-auto">
      <Nav.Link as={NavLink} to={PURCHASE_REQUESTS_ENDPOINT}>
        <i className="bi bi-basket me-2" />
        Requisições de Compra
      </Nav.Link>
    </Nav>
  );
}

function AdminNavbar() {
  return (
    <Nav className="me-auto">
      <Nav.Link as={NavLink} to={SUPPLIERS_ENDPOINT}>
        <i className="bi bi-truck me-2" />
        Fornecedores
      </Nav.Link>
      <Nav.Link as={NavLink} to={CONTACTS_ENDPOINT}>
        <i className="bi bi-person me-2" />
        Contatos
      </Nav.Link>
      <Nav.Link as={NavLink} to={PRODUCTS_ENDPOINT}>
        <i className="bi bi-box me-2" />
        Produtos
      </Nav.Link>
      <Nav.Link as={NavLink} to={PURCHASE_REQUESTS_ENDPOINT}>
        <i className="bi bi-basket me-2" />
        Requisições de Compra
      </Nav.Link>
      <Nav.Link as={NavLink} to={USERS_ENDPOINT}>
        <i className="bi bi-people me-2" />
        Usuários
      </Nav.Link>
    </Nav>
  );
}
