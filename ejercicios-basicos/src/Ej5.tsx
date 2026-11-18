import { useState } from "react";

interface Item {
  id: number;
  texto: string;
}

export default function Ej5() {
  //bajo capot
  const [texto, setTexto] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  function agregar() {
    if (texto.trim() === "") {
      return;
    }
    setItems([...items, { id: Date.now(), texto: texto.trim() }]);
    setTexto("");
  }

  function eliminar(id: number) {
    setItems(items.filter((i) => i.id !== id));
  }

  //carroceria
  return (
    <div>
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <button onClick={agregar}>Agregar</button>

      {items.length === 0 ? (
        <p>No hay nada para comprar</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.texto}
              <button onClick={() => eliminar(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

