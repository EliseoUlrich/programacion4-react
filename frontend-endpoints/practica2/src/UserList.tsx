import { useEffect, useState } from "react";
import { UserDetail } from "./UserDetail";

interface User {
  id: number;
  name: string;
}

export function UserList({ token }: { token: string }) {
  //bajo capot
  const [users, setUsers] = useState<User[]>([]);
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Saludo (paso 6): primero pido mi id y después mis datos
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user/me/id`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      const data = await respuesta.json();
      if (!respuesta.ok) return;
      const respuestaMe = await fetch(`${import.meta.env.VITE_API_URL}/user/${data.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataMe = await respuestaMe.json();
      if (respuestaMe.ok) setMe(dataMe);
    });
  }, [token]);

  useEffect(() => {
    // Para probar el error: cambiar /user por /usr  ->  "Not Found"
    fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      const data = await respuesta.json();
      setLoading(false);
      if (!respuesta.ok) {
        setError(data.detail);
        return;
      }
      setUsers(data);
    });
  }, [token]);

  //carroceria
  return (
    <div>
      {me && <h2>Hola, {me.name.split(" ")[0]}</h2>}

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedId(user.id)}
              style={{ cursor: "pointer" }}
            >
              {user.name}
            </li>
          ))}
        </ul>
      )}

      {/* key: al elegir otro usuario el componente arranca de cero */}
      {selectedId !== null && (
        <UserDetail key={selectedId} token={token} userId={selectedId} />
      )}
    </div>
  );
}

