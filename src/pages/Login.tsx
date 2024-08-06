import { useContext, useState } from "react";
import { Col, Container, FloatingLabel, Form, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

//import ButtonCarregamento from "../componentes/ButtonCarregamento";
import { loginAndSaveSession } from "../model/firebase";
import { FirebaseError } from "firebase/app";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  async function handleSubmit() {
    if (!email || !password) {
      Toast.fire({
        icon: "warning",
        title: "Preencha todos os campos.",
      });
      return;
    }

    try {
      await loginAndSaveSession(email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Erro ao realizar login: ", error.code, error.message);
        Swal.fire("Erro", "Email ou senha inválidos.", "warning");
        return;
      }

      console.error("Erro ao realizar login: ", error);
      Swal.fire("Erro", "Erro ao realizar login.", "error");
      return;
    }

    Swal.fire("Sucesso", "Login realizado com sucesso.\nRedirecionando...", "success");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="4">
          <h2 className="text-center mb-3">Login</h2>
          <FloatingLabel controlId="floatingInput" label="Digite seu email" className="mb-3">
            <Form.Control type="email" value={email} placeholder="" onChange={(e) => setEmail(e.target.value)} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Digite sua senha" className="mb-3">
            <Form.Control type="password" value={password} placeholder="" onChange={(e) => setPassword(e.target.value)} />
          </FloatingLabel>

          {/*
          {!sucesso && (
            <ButtonCarregamento
              variant="primary"
              type="submit"
              className="w-100"
              onClick={handleSubmit}
              loadingMessage="Entrando..."
            >
              Login
            </ButtonCarregamento>
          )}
          */}
          <Button variant="primary" type="submit" className="w-100" onClick={handleSubmit}>
            Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
