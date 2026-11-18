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
  const [busqueda, setBusqueda] = useState(""); // lo que se escribe en el input

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

  // Pide la lista a la URL indicada (todos, búsqueda o mayores) y la guarda
  function cargarUsuarios(url: string) {
    setLoading(true);
    setError(null);
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      const data = await respuesta.json();
      setLoading(false);
      if (!respuesta.ok) {
        // Ojo: en un 422 (datos inválidos) detail es una lista, no un texto
        setError(typeof data.detail === "string" ? data.detail : "Pedido inválido");
        return;
      }
      setUsers(data);
    });
  }

  // Al entrar se carga la lista completa
  useEffect(() => {
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

  function buscar() {
    if (busqueda.trim() === "") {
      cargarUsuarios(`${import.meta.env.VITE_API_URL}/user`);
      return;
    }
    // encodeURIComponent: caracteres como # ? / viajan bien en la URL
    cargarUsuarios(
      `${import.meta.env.VITE_API_URL}/user/search/${encodeURIComponent(busqueda.trim())}`
    );
  }

  function limpiar() {
    setBusqueda("");
    cargarUsuarios(`${import.meta.env.VITE_API_URL}/user`);
  }

  //carroceria
  return (
    <div>
      {me && <h2>Hola, {me.name.split(" ")[0]}</h2>}

      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre"
      />
      <button onClick={buscar}>Buscar</button>
      <button onClick={limpiar}>Limpiar</button>

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && users.length === 0 && <p>No se encontraron usuarios</p>}
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
