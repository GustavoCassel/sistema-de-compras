import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { auth, getFirebaseErrorDescription } from "../context/FirebaseContext";
import { HOME_ENDPOINT } from "../data/constants";
import { Toast } from "../utils/Alerts";

const schema = z
  .object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["password", "confirmPassword"],
    message: "As senhas não coincidem",
  });

type FormData = z.infer<typeof schema>;

export default function Auth() {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [buttonVisible, setButtonVisible] = useState(true);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async ({ email, password }) => {
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        Toast.fire({
          icon: "success",
          title: "Registro realizado com sucesso",
          text: "Você será redirecionado para a página inicial.",
        });
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        const firebaseError = error as FirebaseError;
        setError("root", {
          message: getFirebaseErrorDescription(firebaseError.code),
        });
        return;
      }

      setError("root", {
        message: isLoginMode ? "Erro ao realizar login" : "Erro ao realizar registro",
      });
      return;
    }

    setButtonVisible(false);

    Toast.fire({
      icon: "success",
      title: isLoginMode ? "Login realizado com sucesso" : "Registro realizado com sucesso",
      text: "Redirecionando para a página inicial.",
    });

    setTimeout(() => {
      navigate(HOME_ENDPOINT);
    }, 1000);
  };

  function toggleMode() {
    setIsLoginMode((prevMode) => !prevMode);
    reset();
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="4">
          <h2 className="text-center mb-3">{isLoginMode ? "Login" : "Registrar"}</h2>
          <Form>
            <FloatingLabel controlId="floatingInput" label="Digite seu email" className="mb-3">
              <Form.Control type="email" placeholder="" isInvalid={!!errors.email} {...register("email")} />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId="floatingPassword" label="Digite sua senha" className="mb-3">
              <Form.Control type="password" placeholder="" isInvalid={!!errors.password} {...register("password")} />
              <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </FloatingLabel>

            {!isLoginMode && (
              <FloatingLabel controlId="floatingConfirmPassword" label="Confirme sua senha" className="mb-3">
                <Form.Control type="password" placeholder="" isInvalid={!!errors.confirmPassword} {...register("confirmPassword")} />
                <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
              </FloatingLabel>
            )}

            {buttonVisible && (
              <>
                <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
                  {isSubmitting ? (isLoginMode ? "Entrando..." : "Registrando...") : isLoginMode ? "Entrar" : "Registrar"}
                </Button>
                <Form.Control.Feedback type="invalid" className="d-block mt-2">
                  {errors.root?.message}
                </Form.Control.Feedback>
                <Button variant="link" className="w-100 mt-3" onClick={toggleMode}>
                  {isLoginMode ? "Criar uma conta" : "Já tem uma conta? Entre aqui"}
                </Button>
              </>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
