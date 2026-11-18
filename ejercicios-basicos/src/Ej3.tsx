import { useState } from "react";

export default function Ej3() {
  //bajo capot
  const [visible, setVisible] = useState(false);

  //carroceria
  return (
    <div>
      <h3>¿Qué hook se usa para manejar estado en React?</h3>
      <button onClick={() => setVisible(!visible)}>
        {visible ? "Ocultar respuesta" : "Mostrar respuesta"}
      </button>
      {visible && <p>Se usa el hook useState.</p>}
    </div>
  );
}

