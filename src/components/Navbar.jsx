import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Asegúrate de importar tu contexto de autenticación

const MAX_SCROLL = 100;
const MAX_OFFSET = 20;
const MAX_OFFSET_Y = 20;

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const logoRef = useRef(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Obtener usuario y función de logout del contexto

  // Comprueba si el logo intersecta con los triggers
  const checkIntersections = useCallback(() => {
    const logo = logoRef.current;
    if (!logo) return;
    const { top: logoTop, bottom: logoBottom } = logo.getBoundingClientRect();
    const triggers = document.querySelectorAll('.invert-trigger');
    const intersecting = Array.from(triggers).some(trigger => {
      const { top, bottom } = trigger.getBoundingClientRect();
      return top < logoBottom && bottom > logoTop;
    });
    setIsIntersecting(intersecting);
  }, []);

  // Cerrar el menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll y resize con requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const onResize = () => setIsMobile(window.innerWidth < 768);
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          checkIntersections();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onResize();
    checkIntersections();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [checkIntersections]);

  // Re-check al cambiar de ruta
  useEffect(() => {
    const id = setTimeout(checkIntersections, 100);
    return () => clearTimeout(id);
  }, [location.pathname, checkIntersections]);

  // Cálculo memoizado de offsets
  const { offsetX, offsetY } = useMemo(() => {
    const x = Math.min((scrollY / MAX_SCROLL) * MAX_OFFSET, MAX_OFFSET);
    const y = Math.min((scrollY / MAX_SCROLL) * MAX_OFFSET_Y, MAX_OFFSET_Y);
    return { offsetX: x, offsetY: y };
  }, [scrollY]);

  // Clases compartidas
  const linkBase =
    'group inline-flex items-center gap-2 text-white px-8 py-1 rounded-full backdrop-blur-md bg-black/30 text-lg font-bold tracking-wide transition-all duration-300 hover:scale-110';

  return (
    <>
      <nav className={`w-full fixed top-0 left-0 z-50 py-3 ${isMobile ? 'py-10' : ''}`}>
        <div className="relative w-full mx-auto flex items-center justify-center">
          {/* Logo */}
          <div
            className={`transition-transform duration-300 ${isMobile ? 'absolute left-10' : 'mx-auto'}`}
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            <Link to="/">
              <img
                ref={logoRef}
                src="/resources/logo.svg"
                alt="Logo"
                className={`h-10 drop-shadow-lg transition duration-300 ${
                  isIntersecting ? 'invert' : ''
                }`}
              />
            </Link>
          </div>

          {/* Galería - Desktop only */}
          {!isMobile && (
            <div
              className="transition-transform duration-300 absolute left-10"
              style={{ transform: `translateX(${offsetX}px) translateY(${offsetY}px)` }}
            >
              <Link to="/gallery" className={`${linkBase} overflow-hidden`}>
                <span className="inline-block h-6 overflow-hidden relative">
                  <span className="block transition-transform duration-300 transform group-hover:-translate-y-6">
                    <span className="block h-6 leading-6">GALERÍA</span>
                    <span className="block h-6 leading-6">GALERÍA</span>
                  </span>
                </span>
                <img
                  src="/resources/icono_galeria.svg"
                  alt="Logo"
                  className="w-5 h-5 transform transition-transform duration-500 group-hover:rotate-180"
                />
              </Link>
            </div>
          )}

          {/* Menú de usuario - Right */}
          <div
            className="transition-transform duration-300 absolute right-10"
            style={{ transform: `translateX(-${offsetX}px) translateY(${offsetY}px)` }}
            ref={dropdownRef}
          >
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`${linkBase} overflow-hidden`}
              >
                <div className="overflow-hidden h-6">
                  <div className="transition-transform duration-300 transform group-hover:-translate-y-6">
                    <span className="block h-6 leading-6">MENÚ</span>
                    <span className="block h-6 leading-6">MENÚ</span>
                  </div>
                </div>
              </button>

              {/* Menú desplegable */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {user ? (
                    // Usuario autenticado (normal o admin)
                    <>
                      <Link
                        to="/saved"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Guardados
                      </Link>
                      <Link
                        to="/contacto"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Contacto
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                          navigate('/');
                        }}
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    // Usuario no autenticado
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        to="/contacto"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Contacto
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Botón Galería móvil */}
      {isMobile && (
        <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
          <Link to="/gallery" className={`${linkBase} overflow-hidden`}>
            <span className="inline-block h-6 overflow-hidden relative">
              <span className="block transition-transform duration-300 transform group-hover:-translate-y-6">
                <span className="block h-6 leading-6">GALERÍA</span>
                <span className="block h-6 leading-6">GALERÍA</span>
              </span>
            </span>
            <img
              src="/resources/icono_galeria.svg"
              alt="Logo"
              className="w-5 h-5 transform transition-transform duration-500 group-hover:rotate-180"
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;