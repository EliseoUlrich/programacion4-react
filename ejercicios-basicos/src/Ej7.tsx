interface ProductoProps {
  nombre: string;
  precio: number;
  stock: number;
  oferta?: boolean;
}

export default function Ej7() {
  //carroceria
  return (
    <div>
      <Producto nombre="Teclado" precio={25000} stock={8} oferta={true} />
      <Producto nombre="Mouse" precio={12000} stock={0} />
      <Producto nombre="Monitor" precio={180000} stock={3} />
    </div>
  );
}

function Producto({ nombre, precio, stock, oferta }: ProductoProps) {
  //carroceria
  return (
    <div>
      <h3>{nombre}</h3>
      {oferta && <p>¡Oferta!</p>}
      <p>Precio: ${precio}</p>
      <p>{stock === 0 ? "Sin stock" : `Stock: ${stock}`}</p>
    </div>
  );
}

