-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:33065
-- Tiempo de generación: 01-06-2025 a las 07:31:44
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `museo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autor`
--

CREATE TABLE `autor` (
  `id` int(11) NOT NULL,
  `nombre` varchar(250) NOT NULL,
  `url` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `autor`
--

INSERT INTO `autor` (`id`, `nombre`, `url`) VALUES
(1, 'Leonardo da Vinci', 'https://leonardo.example.com'),
(2, 'Frida Kahlo', 'https://frida.example.com'),
(3, 'Pablo Picasso', 'https://picasso.example.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id` int(11) NOT NULL,
  `categoria` varchar(250) NOT NULL,
  `descripcion` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id`, `categoria`, `descripcion`) VALUES
(1, 'Pintura', 'Obras realizadas en lienzo o superficie similar'),
(2, 'Escultura', 'Obras tridimensionales de diferentes materiales'),
(3, 'Arte digital', 'Obras creadas por medios tecnológicos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `epoca`
--

CREATE TABLE `epoca` (
  `id` int(11) NOT NULL,
  `nombre_epoca` varchar(250) NOT NULL,
  `ano_inicio` varchar(50) NOT NULL,
  `ano_fin` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `epoca`
--

INSERT INTO `epoca` (`id`, `nombre_epoca`, `ano_inicio`, `ano_fin`) VALUES
(1, 'Renacimiento', '1300', '1600'),
(2, 'Modernismo', '1800', '1945'),
(3, 'Contemporáneo', '1945', '2025');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_conservacion`
--

CREATE TABLE `estado_conservacion` (
  `id` int(11) NOT NULL,
  `estado` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_conservacion`
--

INSERT INTO `estado_conservacion` (`id`, `estado`) VALUES
(1, 'Excelente'),
(2, 'Bueno'),
(3, 'Deteriorado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen`
--

CREATE TABLE `imagen` (
  `id` int(11) NOT NULL,
  `ruta_imagen` varchar(250) NOT NULL,
  `OBJETO_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagen`
--

INSERT INTO `imagen` (`id`, `ruta_imagen`, `OBJETO_id`) VALUES
(1, 'alcohol.png', 2),
(2, 'REQUERIMIENTOS TECNOLOGIAS WEB I.pdf', 1),
(3, 'guernica.png', 3),
(12, 'desktop.ini', 9),
(13, 'desktop.ini', 9),
(14, 'desktop.ini', 9),
(15, 'desktop.ini', 9),
(16, 'museo.sql', 9),
(19, 'museo.sql', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelo`
--

CREATE TABLE `modelo` (
  `OBJETO_id` int(11) NOT NULL,
  `ruta_modelo` varchar(250) NOT NULL,
  `ruta_fondo` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modelo`
--

INSERT INTO `modelo` (`OBJETO_id`, `ruta_modelo`, `ruta_fondo`) VALUES
(1, 'REQUERIMIENTOS TECNOLOGIAS WEB I.pdf', 'fondo_gioconda.png'),
(2, 'fridas.glb', 'fondo_fridas.png'),
(3, 'guernica.glb', 'fondo_guernica.png'),
(5, 'REQUERIMIENTOS TECNOLOGIAS WEB I.pdf', 'REQUERIMIENTOS TECNOLOGIAS WEB I.pdf'),
(7, 'desktop.ini', 'desktop.ini');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `objeto`
--

CREATE TABLE `objeto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(250) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_creacion` date NOT NULL,
  `valor_historico` text NOT NULL,
  `nro_visitas` int(11) NOT NULL,
  `ruta_preview` varchar(250) NOT NULL,
  `EPOCA_id` int(11) NOT NULL,
  `UBICACION_ACTUAL_id` int(11) NOT NULL,
  `ESTADO_CONSERVACION_id` int(11) NOT NULL,
  `PROCEDENCIA_id` int(11) NOT NULL,
  `CATEGORIA_id` int(11) NOT NULL,
  `AUTOR_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `objeto`
--

INSERT INTO `objeto` (`id`, `nombre`, `descripcion`, `fecha_creacion`, `valor_historico`, `nro_visitas`, `ruta_preview`, `EPOCA_id`, `UBICACION_ACTUAL_id`, `ESTADO_CONSERVACION_id`, `PROCEDENCIA_id`, `CATEGORIA_id`, `AUTOR_id`) VALUES
(1, 'La Gioconda', 'Retrato de una mujer', '1503-06-01', 'Obra maestra del Renacimiento', 100000, 'preview_gioconda.jpg', 1, 3, 1, 1, 1, 1),
(2, 'Las Dos Fridas', 'Pintura de doble autorretrato', '1939-01-01', 'Obra icónica del arte mexicano', 50000, 'preview_fridas.jpg', 2, 2, 2, 2, 1, 2),
(3, 'Guernica', 'Pintura simbólica sobre la guerra', '1937-04-26', 'Obra clave del siglo XX', 75000, 'preview_guernica.jpg', 2, 3, 1, 3, 1, 3),
(5, '55555555555', '5555555555', '2025-05-05', '555555555555555', 5, 'desktop.ini', 1, 1, 1, 1, 1, 1),
(7, '55555', '55555', '2025-05-05', '5555', 5, 'desktop.ini', 1, 1, 2, 3, 2, 1),
(9, 'wwwwww', 'wwww222', '2025-05-05', 'wwww', 2, 'REQUERIMIENTOS TECNOLOGIAS WEB I.pdf', 1, 1, 2, 1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `procedencia`
--

CREATE TABLE `procedencia` (
  `id` int(11) NOT NULL,
  `nombre_region` varchar(250) NOT NULL,
  `descripcion` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `procedencia`
--

INSERT INTO `procedencia` (`id`, `nombre_region`, `descripcion`) VALUES
(1, 'Italia', 'Origen italiano'),
(2, 'México', 'Origen mexicano'),
(3, 'España', 'Origen español');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicacion_actual`
--

CREATE TABLE `ubicacion_actual` (
  `id` int(11) NOT NULL,
  `pais` varchar(250) NOT NULL,
  `museo` varchar(250) NOT NULL,
  `contacto` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ubicacion_actual`
--

INSERT INTO `ubicacion_actual` (`id`, `pais`, `museo`, `contacto`) VALUES
(1, 'Italia', 'Museo Uffizi', 'uffizi@museo.it'),
(2, 'México', 'Museo Frida Kahlo', 'contacto@frida.mx'),
(3, 'Francia', 'Museo del Louvre', 'info@louvre.fr');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(250) NOT NULL,
  `apellido` varchar(250) NOT NULL,
  `usuario` varchar(250) NOT NULL,
  `contrasena` varchar(250) NOT NULL,
  `correo_electronico` varchar(250) NOT NULL,
  `admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `apellido`, `usuario`, `contrasena`, `correo_electronico`, `admin`) VALUES
(1, 'Admin', 'General', 'admin', '1234', 'admin@example.com', 1),
(2, 'Juan', 'Pérez', 'jperez', 'abcd', 'juan@example.com', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `video`
--

CREATE TABLE `video` (
  `id` int(11) NOT NULL,
  `ruta_video` varchar(250) NOT NULL,
  `OBJETO_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `video`
--

INSERT INTO `video` (`id`, `ruta_video`, `OBJETO_id`) VALUES
(1, 'https://video.example.com/gioconda.mp4', 1),
(2, 'https://video.example.com/fridas.mp4', 2),
(3, 'https://video.example.com/guernica.mp4', 3),
(5, 'https://kick.com/55555', 5),
(7, 'https://kick.com/55', 7),
(10, 'https://2222', 7),
(11, 'https://3333', 5),
(12, 'https://wwww', 9),
(13, 'https://3333', 9),
(14, 'https://2222', 9);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `autor`
--
ALTER TABLE `autor`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `epoca`
--
ALTER TABLE `epoca`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estado_conservacion`
--
ALTER TABLE `estado_conservacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OBJETO_id` (`OBJETO_id`);

--
-- Indices de la tabla `modelo`
--
ALTER TABLE `modelo`
  ADD PRIMARY KEY (`OBJETO_id`);

--
-- Indices de la tabla `objeto`
--
ALTER TABLE `objeto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `EPOCA_id` (`EPOCA_id`),
  ADD KEY `UBICACION_ACTUAL_id` (`UBICACION_ACTUAL_id`),
  ADD KEY `ESTADO_CONSERVACION_id` (`ESTADO_CONSERVACION_id`),
  ADD KEY `PROCEDENCIA_id` (`PROCEDENCIA_id`),
  ADD KEY `CATEGORIA_id` (`CATEGORIA_id`),
  ADD KEY `AUTOR_id` (`AUTOR_id`);

--
-- Indices de la tabla `procedencia`
--
ALTER TABLE `procedencia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ubicacion_actual`
--
ALTER TABLE `ubicacion_actual`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OBJETO_id` (`OBJETO_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `autor`
--
ALTER TABLE `autor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `epoca`
--
ALTER TABLE `epoca`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estado_conservacion`
--
ALTER TABLE `estado_conservacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `imagen`
--
ALTER TABLE `imagen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `objeto`
--
ALTER TABLE `objeto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `procedencia`
--
ALTER TABLE `procedencia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ubicacion_actual`
--
ALTER TABLE `ubicacion_actual`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `video`
--
ALTER TABLE `video`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD CONSTRAINT `imagen_ibfk_1` FOREIGN KEY (`OBJETO_id`) REFERENCES `objeto` (`id`);

--
-- Filtros para la tabla `modelo`
--
ALTER TABLE `modelo`
  ADD CONSTRAINT `modelo_ibfk_1` FOREIGN KEY (`OBJETO_id`) REFERENCES `objeto` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `objeto`
--
ALTER TABLE `objeto`
  ADD CONSTRAINT `objeto_ibfk_1` FOREIGN KEY (`EPOCA_id`) REFERENCES `epoca` (`id`),
  ADD CONSTRAINT `objeto_ibfk_2` FOREIGN KEY (`UBICACION_ACTUAL_id`) REFERENCES `ubicacion_actual` (`id`),
  ADD CONSTRAINT `objeto_ibfk_3` FOREIGN KEY (`ESTADO_CONSERVACION_id`) REFERENCES `estado_conservacion` (`id`),
  ADD CONSTRAINT `objeto_ibfk_4` FOREIGN KEY (`PROCEDENCIA_id`) REFERENCES `procedencia` (`id`),
  ADD CONSTRAINT `objeto_ibfk_5` FOREIGN KEY (`CATEGORIA_id`) REFERENCES `categoria` (`id`),
  ADD CONSTRAINT `objeto_ibfk_6` FOREIGN KEY (`AUTOR_id`) REFERENCES `autor` (`id`);

--
-- Filtros para la tabla `video`
--
ALTER TABLE `video`
  ADD CONSTRAINT `video_ibfk_1` FOREIGN KEY (`OBJETO_id`) REFERENCES `objeto` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
