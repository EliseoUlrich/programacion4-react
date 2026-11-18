import { useState } from "react";

export default function Ej4() {
  //bajo capot
  const [celsius, setCelsius] = useState("");
  const fahrenheit = (Number(celsius) * 9) / 5 + 32;

  //carroceria
  return (
    <div>
      <input
        type="number"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
        placeholder="Grados Celsius"
      />
      <p>
        {celsius} °C = {fahrenheit} °F
      </p>
      {Number(celsius) > 30 && <p>Hace calor</p>}
    </div>
  );
}

