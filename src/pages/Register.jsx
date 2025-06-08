import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VideoBanner from '../components/VideoBanner';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    correo_electronico: '',
    contrasena: '',
    admin: false
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre es obligatorio';
    if (!formData.apellido.trim()) newErrors.apellido = 'Apellido es obligatorio';
    if (!formData.usuario.trim()) newErrors.usuario = 'Usuario es obligatorio';
    if (!formData.correo_electronico) {
      newErrors.correo_electronico = 'Email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = 'Email inválido';
    }
    if (!formData.contrasena) {
      newErrors.contrasena = 'Contraseña es obligatoria';
    } else if (formData.contrasena.length < 6) {
      newErrors.contrasena = 'Mínimo 6 caracteres';
    }
    return newErrors;
  };

  const checkExistingCredentials = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/usuarios');
      const usuarios = await response.json();
      return usuarios.find(u => u.usuario === formData.usuario || u.correo_electronico === formData.correo_electronico);
    } catch (error) {
      console.error('Error verificando credenciales:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError('');
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const existingUser = await checkExistingCredentials();
      if (existingUser) {
        if (existingUser.usuario === formData.usuario) {
          setErrors({ usuario: 'Este usuario ya está registrado' });
        } else {
          setErrors({ correo_electronico: 'Este email ya está registrado' });
        }
        setLoading(false);
        return;
      }
      const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al registrar usuario');
      setSuccess(true);
      setFormData({
        nombre: '',
        apellido: '',
        usuario: '',
        correo_electronico: '',
        contrasena: '',
        admin: false
      });
    } catch (error) {
      setBackendError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado izquierdo: video */}
      <div className="hidden md:flex w-7/10 text-white">
        <VideoBanner />
      </div>

      {/* Lado derecho: formulario */}
      <div className="w-full md:w-3/10 flex items-center justify-center bg-white px-6 py-12">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Crear Cuenta</h2>

          {success ? (
            <div className="text-green-600 text-center">
              <p>¡Registro exitoso!</p>
              <p>Ahora puedes iniciar sesión con tus credenciales</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: 'nombre', label: 'Nombre', type: 'text' },
                { name: 'apellido', label: 'Apellido', type: 'text' },
                { name: 'usuario', label: 'Usuario', type: 'text' },
                { name: 'correo_electronico', label: 'Correo Electrónico', type: 'email' },
                { name: 'contrasena', label: 'Contraseña', type: 'password' },
              ].map(({ name, label, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700">{label}:</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {errors[name] && <p className="text-red-600 text-sm">{errors[name]}</p>}
                </div>
              ))}

            

              {backendError && <p className="text-red-600 text-sm">{backendError}</p>}

          <button
  type="submit"
  disabled={loading}
  className="mt-2 inline-block group w-full bg-black text-white py-2 rounded-md overflow-hidden relative"
>
  <div className="h-6 overflow-hidden">
    <div className="transform transition-transform duration-300 group-hover:-translate-y-6">
      <span className="block h-6 leading-6">
        {loading ? 'Registrando...' : 'Crear Cuenta'}
      </span>
      <span className="block h-6 leading-6">
        {loading ? 'Registrando...' : 'Crear Cuenta'}
      </span>
    </div>
  </div>
</button>
            </form>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">¿Ya tienes cuenta?</p>
            <Link to="/login" className="text-black hover:underline">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
