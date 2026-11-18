import { useEffect, useState } from "react";

interface Country {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

// GET /user/{id} trae todos los datos de un solo usuario
interface UserDetailData {
  id: number;
  name: string;
  email: string;
  age: number;
  country: Country | null;
  roles: Role[];
}

export function UserDetail({ token, userId }: { token: string; userId: number }) {
  //bajo capot
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cada vez que cambia el id elegido, se pide el detalle de ese usuario
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      const data = await respuesta.json();
      if (!respuesta.ok) {
        setError(data.detail);
        return;
      }
      setUser(data);
    });
  }, [token, userId]);

  //carroceria
  if (error) return <p>{error}</p>;
  if (!user) return null;

  return (
    <div>
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Edad: {user.age}</p>
      <p>País: {user.country ? user.country.name : "Sin país"}</p>
      <p>Roles: {user.roles.map((r) => r.name).join(", ")}</p>
    </div>
  );
}

