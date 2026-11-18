import { useState } from "react";

const lenguajes = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "Go",
  "Rust",
  "PHP",
  "Kotlin",
];

export default function Ej6() {
  //bajo capot
  const [busqueda, setBusqueda] = useState("");
  const filtrados = lenguajes.filter((l) =>
    l.toLowerCase().includes(busqueda.toLowerCase())
  );

  //carroceria
  return (
    <div>
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar lenguaje..."
      />
      <p>{filtrados.length} resultados</p>
      <ul>
        {filtrados.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

