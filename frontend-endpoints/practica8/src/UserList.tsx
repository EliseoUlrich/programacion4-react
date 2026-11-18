import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { UserDetail } from "./UserDetail";

interface Role {
  id: number;
  name: string;
}

// Ampliamos la interfaz: GET /user/{id} ya trae los roles (GET /user no)
interface User {
  id: number;
  name: string;
  roles?: Role[];
}

interface UserListProps {
  token: string;
  onUnauthorized: () => void; // función de App que cierra la sesión
}

export function UserList({ token, onUnauthorized }: UserListProps) {
  //bajo capot
  const [users, setUsers] = useState<User[]>([]);
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState(""); // lo que se escribe en el input
  const [soloMayores, setSoloMayores] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null); // resultado del alta / borrado

  // Formulario de alta
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryId, setCountryId] = useState("1");

  // Saludo (paso 6): primero pido mi id y después mis datos (que incluyen los roles)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user/me/id`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      if (respuesta.status === 401) {
        onUnauthorized(); // token vencido o inválido: se avisa a App
        return;
      }
      const data = await respuesta.json();
      if (!respuesta.ok) return;
      const respuestaMe = await fetch(`${import.meta.env.VITE_API_URL}/user/${data.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (respuestaMe.status === 401) {
        onUnauthorized();
        return;
      }
      const dataMe = await respuestaMe.json();
      if (respuestaMe.ok) setMe(dataMe);
    });
  }, [token, onUnauthorized]);

  // Pide la lista a la URL indicada (todos, búsqueda o mayores) y la guarda
  function cargarUsuarios(url: string) {
    setLoading(true);
    setError(null);
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      if (respuesta.status === 401) {
        onUnauthorized();
        return;
      }
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
      if (respuesta.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await respuesta.json();
      setLoading(false);
      if (!respuesta.ok) {
        setError(data.detail);
        return;
      }
      setUsers(data);
    });
  }, [token, onUnauthorized]);

  function buscar() {
    setSoloMayores(false);
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
    setSoloMayores(false);
    cargarUsuarios(`${import.meta.env.VITE_API_URL}/user`);
  }

  function alternarMayores() {
    const nuevo = !soloMayores;
    setSoloMayores(nuevo);
    setBusqueda("");
    if (nuevo) {
      cargarUsuarios(`${import.meta.env.VITE_API_URL}/user_mayores`);
    } else {
      cargarUsuarios(`${import.meta.env.VITE_API_URL}/user`);
    }
  }

  async function crearUsuario(evento: SubmitEvent) {
    evento?.preventDefault();
    setMensaje(null);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        age: Number(age),
        email,
        password,
        country_id: Number(countryId),
      }),
    });
    if (response.status === 401) {
      onUnauthorized();
      return;
    }
    // Si el email ya existe el backend responde 500 sin JSON, por eso el catch
    const data = await response
      .json()
      .catch(() => ({ detail: "Error del servidor (¿email repetido?)" }));
    if (!response.ok) {
      // Con sfer: 403 "Missing permission: write_users"
      setMensaje(typeof data.detail === "string" ? data.detail : "Datos inválidos");
      return;
    }
    // La API devuelve { id }: se agrega a la lista sin recargar la página
    setUsers([...users, { id: data.id, name }]);
    setMensaje(`Usuario creado con id ${data.id}`);
    setName("");
    setAge("");
    setEmail("");
    setPassword("");
    setCountryId("1");
  }

  async function borrar(user: User) {
    if (!window.confirm(`¿Seguro que querés borrar a ${user.name}?`)) return;
    setMensaje(null);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${user.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 401) {
      onUnauthorized();
      return;
    }
    const data = await response.json();
    if (!response.ok) {
      // Con sfer: 403 "Missing permission: delete_users"
      setMensaje(data.detail);
      return;
    }
    // Se saca de la lista sin volver a pedirla
    setUsers(users.filter((u) => u.id !== user.id));
    if (selectedId === user.id) setSelectedId(null);
    setMensaje(data.msg);
  }

  //carroceria
  return (
    <div>
      {me && (
        <h2>
          Hola, {me.name.split(" ")[0]} ({me.roles?.map((r) => r.name).join(", ")})
        </h2>
      )}

      <h3>Nuevo usuario</h3>
      <form onSubmit={crearUsuario}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Edad"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          minLength={4}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* No hay endpoint de países: las opciones van a mano */}
        <select value={countryId} onChange={(e) => setCountryId(e.target.value)}>
          <option value="1">Argentina</option>
          <option value="2">Brasil</option>
        </select>
        <button type="submit">Crear</button>
      </form>
      {mensaje && <p>{mensaje}</p>}

      <h3>Usuarios: {soloMayores ? "Solo mayores" : "Todos"}</h3>
      <button onClick={alternarMayores}>
        {soloMayores ? "Ver todos" : "Ver solo mayores"}
      </button>
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
            <li key={user.id}>
              <span onClick={() => setSelectedId(user.id)} style={{ cursor: "pointer" }}>
                {user.name}
              </span>{" "}
              <button onClick={() => borrar(user)}>Borrar</button>
            </li>
          ))}
        </ul>
      )}

      {/* key: al elegir otro usuario el componente arranca de cero */}
      {selectedId !== null && (
        <UserDetail
          key={selectedId}
          token={token}
          userId={selectedId}
          onUnauthorized={onUnauthorized}
        />
      )}
    </div>
  );
}
