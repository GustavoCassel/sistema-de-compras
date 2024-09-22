import { useContext, useEffect, useState } from "react";
import { Badge, Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { FirebaseUserContext } from "../../App";
import Loading from "../../components/Loading";
import { FirebaseUser, firebaseUserRepository } from "../../models/FirebaseUserRepository";
import { Toast } from "../../utils/Alerts";

export default function Users() {
  const loggedFirebaseUser = useContext(FirebaseUserContext);
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFirebaseUsers();
  }, []);

  async function loadFirebaseUsers() {
    setLoading(true);
    try {
      const users = await firebaseUserRepository.getAll();

      setUsers(users);
    } catch (error) {
      const err = error as Error;
      Swal.fire({
        icon: "error",
        title: "Erro ao carregar contatos",
        html: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  function toggleAdmin(user: FirebaseUser) {
    try {
      if (user.isAdmin) {
        if (isRootAdmin(user)) {
          throw new Error("O root admin não pode ser revogado.");
        }

        if (user.email === loggedFirebaseUser?.email) {
          throw new Error("Você não pode revogar seu próprio admin.");
        }

        firebaseUserRepository.revokeAdmin(user.id);
      } else {
        firebaseUserRepository.makeAdmin(user.id);
      }
    } catch (error) {
      const err = error as Error;
      Toast.fire({
        icon: "error",
        title: `Erro ao ${user.isAdmin ? "revogar" : "tornar"} admin`,
        text: err.message,
      });
      return;
    }

    loadFirebaseUsers();

    Toast.fire({
      icon: "success",
      title: `Usuário ${user.isAdmin ? "revogado" : "tornado"} admin com sucesso`,
    });
  }

  function toggleBlocked(user: FirebaseUser) {
    try {
      if (user.blocked) {
        firebaseUserRepository.unblock(user.id);
      } else {
        if (isRootAdmin(user)) {
          throw new Error("O root admin não pode ser bloqueado.");
        }

        if (user.email === loggedFirebaseUser?.email) {
          throw new Error("Você não pode bloquear seu próprio usuário.");
        }

        firebaseUserRepository.block(user.id);
      }
    } catch (error) {
      const err = error as Error;
      Toast.fire({
        icon: "error",
        title: `Erro ao ${user.blocked ? "desbloquear" : "bloquear"} usuário`,
        text: err.message,
      });
      return;
    }

    loadFirebaseUsers();

    Toast.fire({
      icon: "success",
      title: `Usuário ${user.blocked ? "desbloqueado" : "bloqueado"} com sucesso`,
    });
  }

  function isRootAdmin(user: FirebaseUser): boolean {
    const rootAdminEmail = process.env.REACT_APP_ROOT_ADMIN_EMAIL;
    if (!rootAdminEmail) {
      throw new Error("E-mail do root admin não configurado.");
    }
    return user.email === rootAdminEmail;
  }

  return (
    <div>
      <h2>Usuários</h2>

      {loading ? (
        <Loading />
      ) : (
        <Table striped bordered hover size="sm" responsive>
          <thead>
            <tr>
              <th>E-mail</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  <Badge bg={user.isAdmin ? "danger" : "success"} className="ms-2">
                    {user.isAdmin ? "Admin" : "Usuário"}
                  </Badge>
                </td>
                <td>
                  <Badge bg={user.blocked ? "danger" : "success"} className="ms-2">
                    {user.blocked ? "Bloqueado" : "Ativo"}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant={user.isAdmin ? "success" : "danger"}
                    className={user.isAdmin ? "bi bi-person-dash" : "bi bi-person-check"}
                    style={{ marginRight: "5px", minWidth: "150px" }}
                    title={user.isAdmin ? "Revogar Admin" : "Tornar Admin"}
                    onClick={() => toggleAdmin(user)}
                  >
                    {user.isAdmin ? "Revogar Admin" : "Tornar Admin"}
                  </Button>
                  <Button
                    variant={user.blocked ? "success" : "danger"}
                    className={user.blocked ? "bi bi-person-check" : "bi bi-person-dash"}
                    style={{ marginRight: "5px", minWidth: "150px" }}
                    title={user.blocked ? "Desbloquear" : "Bloquear"}
                    onClick={() => toggleBlocked(user)}
                  >
                    {user.blocked ? "Desbloquear" : "Bloquear"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
