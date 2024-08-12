import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { loginAndSaveSession } from "../api/firebase";
import { useNavigate } from "react-router-dom";

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
        Swal.fire("Erro", "Email ou senha inválidos.", "warning");
        return;
      }

      Swal.fire("Erro", "Erro ao realizar login.", "error");
      return;
    }

    Toast.fire({
      icon: "success",
      title: "Login realizado com sucesso.\nRedirecionando...",
    });

    setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  function preencherLoginAdmin() {
    setEmail("usuario@react.com");
    setPassword("react123");
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

          <Button variant="primary" type="submit" className="w-100" onClick={handleSubmit}>
            Login
          </Button>

          <Button variant="primary" onClick={preencherLoginAdmin}>
            preencher login admin
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
