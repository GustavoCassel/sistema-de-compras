import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { z } from "zod";
import { Button } from "../components";
import { auth, getFirebaseErrorDescription } from "../context/FirebaseContext";
import { HOME_ENDPOINT } from "../data/constants";
import { FirebaseUser, firebaseUserRepository } from "../models/FirebaseUserRepository";
import { Toast } from "../utils/Alerts";

const schema = z
  .object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }).optional(),
  })
  .refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

type FormData = z.infer<typeof schema>;

export default function LoginRegister() {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [buttonVisible, setButtonVisible] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async ({ email, password }) => {
    try {
      if (isLoginMode) {
        const firebaseUser = await firebaseUserRepository.getUniqueByField("email", email);

        if (firebaseUser?.blocked) {
          Swal.fire({
            icon: "error",
            title: "Usuário bloqueado",
            text: "Você foi bloqueado. Entre em contato com o administrador.",
          });
          return;
        }

        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);

        const firebaseUser = new FirebaseUser();
        firebaseUser.email = email;
        await firebaseUserRepository.create(firebaseUser);
      }
    } catch (error) {
      let errorMessage: string = "Erro desconhecido";

      if (error instanceof FirebaseError) {
        const firebaseError = error as FirebaseError;
        errorMessage = getFirebaseErrorDescription(firebaseError.code);
      }

      Toast.fire({
        icon: "error",
        title: isLoginMode ? "Erro ao realizar login" : "Erro ao realizar registro",
        text: errorMessage,
      });

      return;
    }

    setButtonVisible(false);

    Toast.fire({
      icon: "success",
      title: isLoginMode ? "Login realizado com sucesso" : "Registro realizado com sucesso",
      text: "Redirecionando para a página inicial.",
    });

    navigate(HOME_ENDPOINT);
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
            <fieldset disabled={isSubmitting}>
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
                  <Button type="submit" className="w-100" onClick={handleSubmit(onSubmit)}>
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
            </fieldset>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
