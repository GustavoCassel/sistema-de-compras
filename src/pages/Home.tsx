import { useEffect } from "react";
import { navigateByLoginState } from "../api/firebase";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigateByLoginState(navigate);
  }, []);

  return (
    <div className="text-center mt-5">
      <h2>Sistema de Compras</h2>
      <p>Bem-vindo ao sistema de compras!</p>
    </div>
  );
}
