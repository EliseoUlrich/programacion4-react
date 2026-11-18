import { useState } from "react";
import type { SubmitEvent } from "react";
import { UserList } from "./UserList";

export default function App() {
  //bajo capot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  async function handleSubmit(evento: SubmitEvent) {
    evento?.preventDefault();
    setError(null);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.detail);
      return;
    }
    localStorage.setItem("token", data.token);
    setToken(data.token);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  // UserList llama a esta función cuando algún pedido responde 401
  function handleUnauthorized() {
    logout();
    setError("Tu sesión venció");
  }

  //carroceria
  if (token) {
    return (
      <div>
        <button onClick={logout}>Salir</button>
        <UserList token={token} onUnauthorized={handleUnauthorized} />
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Ingresar</button>
      {error && <p>{error}</p>}
    </form>
  );
}

