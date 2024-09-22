import { useContext } from "react";
import { Badge, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import { DarkThemeContext, FirebaseUserContext } from "../../App";
import { Button } from "../../components";
import {
  CONTACTS_ENDPOINT,
  HOME_ENDPOINT,
  LOGOUT_ENDPOINT,
  PRODUCTS_ENDPOINT,
  PURCHASE_REQUESTS_ENDPOINT,
  SUPPLIERS_ENDPOINT,
  USERS_ENDPOINT,
} from "../../data/constants";
import "./styles.css";

export default function AppHeader() {
  const user = useContext(FirebaseUserContext);
  const { isDarkMode, toggleDarkMode } = useContext(DarkThemeContext);

  return (
    <>
      <Navbar
        expand="lg"
        style={{
          borderBottom: `2px solid rgba(0, 0, 0, ${isDarkMode ? 0.5 : 0.1})`,
          boxShadow: `0 2px 4px rgba(0, 0, 0, ${isDarkMode ? 0.5 : 0.1})`,
        }}
      >
        <Container>
          <Navbar.Brand as={NavLink} to={HOME_ENDPOINT}>
            <i className="bi bi-cart3 me-2" />
            Sistema de Compras
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            {user && (
              <>
                {user.isAdmin ? <AdminNavbar /> : <UserNavbar />}
                <Nav className="ms-auto align-items-center">
                  <Nav.Item className="d-flex flex-column justify-content-center align-items-center">
                    <Badge bg={user.isAdmin ? "danger" : "success"} className="ms-2">
                      {user.isAdmin ? "Admin" : "Usuário"}
                    </Badge>
                    <Navbar.Text>
                      <strong>{user.email}</strong>
                    </Navbar.Text>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link as={NavLink} to={LOGOUT_ENDPOINT} className="d-flex align-items-center">
                      <i className="bi bi-box-arrow-right me-2 ms-2" />
                      Sair
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Button variant={isDarkMode ? "light" : "dark"} onClick={toggleDarkMode}>
                      <i className={isDarkMode ? "bi bi-sun" : "bi bi-moon-stars"} />
                    </Button>
                  </Nav.Item>
                </Nav>
              </>
            )}
          </Navbar.Collapse>
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
    <Nav>
      <Nav.Link as={NavLink} to={PURCHASE_REQUESTS_ENDPOINT} className="d-flex align-items-center">
        <i className="bi bi-basket me-2" />
        Requisições de Compra
      </Nav.Link>
    </Nav>
  );
}

function AdminNavbar() {
  return (
    <Nav>
      <Nav.Link as={NavLink} to={SUPPLIERS_ENDPOINT} className="d-flex align-items-center">
        <i className="bi bi-truck me-2" />
        Fornecedores
      </Nav.Link>
      <Nav.Link as={NavLink} to={CONTACTS_ENDPOINT} className="d-flex align-items-center">
        <i className="bi bi-person me-2" />
        Contatos
      </Nav.Link>
      <Nav.Link as={NavLink} to={PRODUCTS_ENDPOINT} className="d-flex align-items-center">
        <i className="bi bi-box me-2" />
        Produtos
      </Nav.Link>
      <Nav.Link as={NavLink} to={PURCHASE_REQUESTS_ENDPOINT} className="d-flex align-items-center">
        <i className="bi bi-basket me-2" />
        Requisições de Compra
      </Nav.Link>
      <Nav.Link as={NavLink} to={USERS_ENDPOINT} className="d-flex align-items-center">
        <i className="bi bi-people me-2" />
        Usuários
      </Nav.Link>
    </Nav>
  );
}
