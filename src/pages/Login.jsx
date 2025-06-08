import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VideoBanner from '../components/VideoBanner';

const Login = () => {
  const [formData, setFormData] = useState({
    identificador: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(''); // 'admin' o 'user'
  const navigate = useNavigate();

  // Verificar si ya hay sesión al cargar el componente
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
      setIsLoggedIn(true);
      setUserType(usuario.admin ? 'admin' : 'user');
      
      // Redirigir al dashboard después de 1.5 segundos
      const timer = setTimeout(() => {
        redirectBasedOnUserType(usuario.admin);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  const redirectBasedOnUserType = (isAdmin) => {
    if (isAdmin) {
      navigate('/');
    } else {
      navigate('/');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.identificador || !formData.contrasena) {
        throw new Error('Todos los campos son obligatorios');
      }

      const response = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error en la autenticación');

      localStorage.setItem('usuario', JSON.stringify(data));
      setIsLoggedIn(true);
      setUserType(data.admin ? 'admin' : 'user');
      
      // Redirigir después de mostrar el mensaje
      setTimeout(() => {
        redirectBasedOnUserType(data.admin);
      }, 1500);
      
    } catch (err) {
      setError(err.message);
      console.error('Error en login:', err);
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = `
    transition-transform duration-300 group relative bg-black text-white py-2 px-4 
    rounded-md overflow-hidden w-full text-center cursor-pointer hover:bg-gray-900
  `;


  // Si el usuario ya está autenticado, mostrar mensaje
  if (isLoggedIn) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const isAdmin = usuario.admin;

    return (
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100">
        <div className="hidden md:block w-7/10 text-white invert-trigger">
          <VideoBanner />
        </div>
        <div className="w-full md:w-3/10 p-8 md:p-12 bg-transparent text-center">
          <div className="bg-black-100 border border-black-400 text-black-700 px-4 py-3 rounded mb-6">
            <h2 className="text-2xl font-bold">¡Ya has iniciado sesión!</h2>
            <p className="mt-2">Bienvenido de nuevo, {usuario.nombre}</p>
            <p className="mt-1 font-medium">
              {isAdmin ? 'Administrador' : 'Usuario'}
            </p>
          </div>
          <div className="flex flex-col gap-4">
 
            <button 
              onClick={() => {
                localStorage.removeItem('usuario');
                setIsLoggedIn(false);
                setUserType('');
              }}
              className={buttonStyle}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100">
      <div className="hidden md:block w-7/10 text-white invert-trigger">
        <VideoBanner />
      </div>

      <div className="w-full md:w-3/10 p-8 md:p-12 bg-transparent">
        <h2 className="text-3xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario o Email:</label>
            <input
              type="text"
              name="identificador"
              value={formData.identificador}
              onChange={handleChange}
              placeholder="Usuario o correo electrónico"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña:</label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="Contraseña"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button type="submit" disabled={loading} className={`${buttonStyle} group`}>
            <div className="h-6 overflow-hidden">
              <div className="transform transition-transform duration-300 group-hover:-translate-y-6">
                <span className="block h-6 leading-6">
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </span>
                <span className="block h-6 leading-6">
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </span>
              </div>
            </div>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">¿No tienes cuenta?</p>
          <Link to="/register" className="text-black hover:underline">
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;