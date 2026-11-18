import { useState } from "react";

export default function Ej2() {
  //bajo capot
  const [valor, setValor] = useState(0);

  function restar() {
    if (valor > 0) {
      setValor(valor - 1);
    }
  }

  function sumar() {
    if (valor < 10) {
      setValor(valor + 1);
    }
  }

  function reiniciar() {
    setValor(0);
  }

  //carroceria
  return (
    <div>
      <h2>{valor}</h2>
      <button onClick={restar} disabled={valor === 0}>
        -
      </button>
      <button onClick={sumar} disabled={valor === 10}>
        +
      </button>
      <button onClick={reiniciar}>Reiniciar</button>
    </div>
  );
}

