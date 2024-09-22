import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components";
import { auth } from "../context/FirebaseContext";
import { HOME_ENDPOINT } from "../data/constants";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    handleSignOut();
  }, []);

  async function handleSignOut() {
    await signOut(auth);
    navigate(HOME_ENDPOINT);
  }

  return <Loading />;
}
