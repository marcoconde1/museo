const Imagenes = ({ imagenes }) => {
  if (!imagenes || imagenes.length === 0) return null;

  return (
      <div>
        {imagenes.map((img, index) => (
          <img
            key={index}
            src={img.ruta_imagen}
            alt={`Imagen ${index + 1}`}
          />
        ))}
      </div>
  );
};

export default Imagenes;
