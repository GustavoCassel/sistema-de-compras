import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { getFirebaseErrorDescription, loginAndSaveSession } from "../context/FirebaseContext";
import { Toast } from "../utils/Alerts";
import { useState } from "react";

const schema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

type LoginData = z.infer<typeof schema>;

export default function Login() {
  const [buttonVisible, setButtonVisible] = useState(true);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginData> = async ({ email, password }) => {
    try {
      await loginAndSaveSession(email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const firebaseError = error as FirebaseError;
        setError("root", {
          message: getFirebaseErrorDescription(firebaseError.code),
        });
        return;
      }

      setError("root", {
        message: "Erro ao realizar login",
      });
      return;
    }

    setButtonVisible(false);

    Toast.fire({
      icon: "success",
      title: "Login realizado com sucesso",
      text: "Redirecionando para a página inicial.",
    });

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="4">
          <h2 className="text-center mb-3">Login</h2>
          <Form>
            <FloatingLabel controlId="floatingInput" label="Digite seu email" className="mb-3">
              <Form.Control type="email" placeholder="" isInvalid={!!errors.email} {...register("email")} />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId="floatingPassword" label="Digite sua senha" className="mb-3">
              <Form.Control type="password" placeholder="" isInvalid={!!errors.password} {...register("password")} />
              <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </FloatingLabel>

            {buttonVisible && (
              <>
                <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </Button>
                <Form.Control.Feedback type="invalid" className="d-block mt-2">
                  {errors.root?.message}
                </Form.Control.Feedback>
              </>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
