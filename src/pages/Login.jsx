import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const [registro, setRegistro] = useState({
    nombre: "",
    apellido: "",
    usuario: "",
    correo: "",
    contrasena: "",
    repetirContrasena: "",
    admin: "0" 
  });
  const [registroError, setRegistroError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:3000/api/usuarios');
      const usuarios = response.data;

      const usuarioValido = usuarios.find(
        (u) => u.correo_electronico === correo && u.contrasena === contrasena
      );

      if (usuarioValido) {
        alert(`Welcome back ${usuarioValido.usuario}`);
        if (usuarioValido.admin === 1) {
          navigate("/admin"); //ACA LO CAMBIAS MARCO XD
        } else {
          navigate("/gallery"); //ACA LO CAMBIAS MARCO XD
        }
      } else {
        setError("Correo o contraseña incorrectos.");
      }
    } catch (err) {
      setError("Error al iniciar sesión.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { nombre, apellido, usuario, correo, contrasena, repetirContrasena, admin } = registro;

    if (!correo.includes("@gmail.com")) {
      setRegistroError("El correo debe ser @gmail.com");
      return;
    }

    if (contrasena !== repetirContrasena) {
      setRegistroError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/usuarios', {
        nombre,
        apellido,
        usuario,
        correo_electronico: correo,
        contrasena,
        admin: 0 // Se fuerza como 0
      });

      alert("Usuario registrado con éxito");
      setRegistroError("");
      setRegistro({
        nombre: "",
        apellido: "",
        usuario: "",
        correo: "",
        contrasena: "",
        repetirContrasena: "",
        admin: "0"
      });
    } catch (err) {
      setRegistroError("Error al registrar usuario.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around", padding: "2rem" }}>
      {/* LOGIN */}
      <div style={{ width: "45%" }}>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <label>Correo electrónico:</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          <br />
          <label>Contraseña:</label>
          <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>

      {/* REGISTER */}
      <div style={{ width: "45%" }}>
        <h2>Registrarse</h2>
        <form onSubmit={handleRegister}>
          <label>Nombre:</label>
          <input type="text" value={registro.nombre} onChange={(e) => setRegistro({ ...registro, nombre: e.target.value })} required />
          <br />
          <label>Apellido:</label>
          <input type="text" value={registro.apellido} onChange={(e) => setRegistro({ ...registro, apellido: e.target.value })} required />
          <br />
          <label>Nombre de usuario:</label>
          <input type="text" value={registro.usuario} onChange={(e) => setRegistro({ ...registro, usuario: e.target.value })} required />
          <br />
          <label>Correo electrónico:</label>
          <input type="email" value={registro.correo} onChange={(e) => setRegistro({ ...registro, correo: e.target.value })} required />
          <br />
          <label>Contraseña:</label>
          <input type="password" value={registro.contrasena} onChange={(e) => setRegistro({ ...registro, contrasena: e.target.value })} required />
          <br />
          <label>Repetir contraseña:</label>
          <input type="password" value={registro.repetirContrasena} onChange={(e) => setRegistro({ ...registro, repetirContrasena: e.target.value })} required />
          <br />
          {registroError && <p style={{ color: "red" }}>{registroError}</p>}
          <button type="submit">Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
