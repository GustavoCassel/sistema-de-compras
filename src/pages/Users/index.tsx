import { useContext, useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { FirebaseUserContext } from "../../App";
import { Button, ExportCsvButton, Loading, Table } from "../../components";
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

  async function toggleAdmin(user: FirebaseUser) {
    try {
      if (user.isAdmin) {
        if (isRootAdmin(user)) {
          throw new Error("O root admin não pode ser revogado.");
        }

        if (user.email === loggedFirebaseUser?.email) {
          throw new Error("Você não pode revogar seu próprio admin.");
        }

        await firebaseUserRepository.revokeAdmin(user.id);
      } else {
        await firebaseUserRepository.makeAdmin(user.id);
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

    await loadFirebaseUsers();

    Toast.fire({
      icon: "success",
      title: `Usuário ${user.isAdmin ? "revogado" : "tornado"} admin com sucesso`,
    });
  }

  async function toggleBlocked(user: FirebaseUser) {
    try {
      if (user.blocked) {
        await firebaseUserRepository.unblock(user.id);
      } else {
        if (isRootAdmin(user)) {
          throw new Error("O root admin não pode ser bloqueado.");
        }

        if (user.email === loggedFirebaseUser?.email) {
          throw new Error("Você não pode bloquear seu próprio usuário.");
        }

        await firebaseUserRepository.block(user.id);
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

    await loadFirebaseUsers();

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
        <Table>
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
              <tr key={user.id} style={{ verticalAlign: "middle" }}>
                <td>{user.email}</td>
                <td>
                  <Badge bg={user.isAdmin ? "danger" : "success"}>{user.isAdmin ? "Admin" : "Usuário"}</Badge>
                </td>
                <td>
                  <Badge bg={user.blocked ? "danger" : "success"}>{user.blocked ? "Bloqueado" : "Ativo"}</Badge>
                </td>
                <td>
                  <Button
                    variant={user.isAdmin ? "success" : "danger"}
                    style={{ marginRight: "5px", minWidth: "175px", textAlign: "left" }}
                    title={user.isAdmin ? "Revogar Admin" : "Tornar Admin"}
                    onClick={() => toggleAdmin(user)}
                  >
                    <i className={user.isAdmin ? "bi bi-x-circle me-2" : "bi bi-check-circle me-2"} />
                    {user.isAdmin ? "Revogar Admin" : "Tornar Admin"}
                  </Button>
                  <Button
                    variant={user.blocked ? "success" : "danger"}
                    style={{ marginRight: "5px", minWidth: "150px", textAlign: "left" }}
                    title={user.blocked ? "Desbloquear" : "Bloquear"}
                    onClick={() => toggleBlocked(user)}
                  >
                    <i className={user.blocked ? "bi bi-unlock me-2" : "bi bi-ban me-2"} />
                    {user.blocked ? "Desbloquear" : "Bloquear"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {users.length !== 0 && <ExportCsvButton data={users} filename="usuarios.csv" />}
    </div>
  );
}
