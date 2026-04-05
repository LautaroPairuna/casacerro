-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 05-04-2026 a las 14:16:03
-- Versión del servidor: 8.4.8
-- Versión de PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `casacerro`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros_auditoria`
--

DROP TABLE IF EXISTS `registros_auditoria`;
CREATE TABLE IF NOT EXISTS `registros_auditoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `correo_actor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accion` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entidad` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entidad_id` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datos_anteriores` json DEFAULT NULL,
  `datos_nuevos` json DEFAULT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `registros_auditoria_creado_en_idx` (`creado_en`),
  KEY `registros_auditoria_entidad_entidad_id_idx` (`entidad`,`entidad_id`),
  KEY `registros_auditoria_correo_actor_idx` (`correo_actor`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `registros_auditoria`
--

INSERT INTO `registros_auditoria` (`id`, `correo_actor`, `accion`, `entidad`, `entidad_id`, `datos_anteriores`, `datos_nuevos`, `creado_en`) VALUES
(1, 'admin@casacerro.com', 'ACTUALIZAR', 'tarifa_habitacion', '1', '{\"precio\": 59000, \"etiqueta\": \"Single / Doble\"}', '{\"precio\": 590000, \"etiqueta\": \"Single / Doble\"}', '2026-04-04 03:18:13.516'),
(2, 'admin@casacerro.com', 'ACTUALIZAR', 'tarifa_habitacion', '1', '{\"precio\": 590000, \"etiqueta\": \"Single / Doble\"}', '{\"precio\": 59000, \"etiqueta\": \"Single / Doble\"}', '2026-04-04 03:21:34.293'),
(3, 'admin@casacerro.com', 'ACTUALIZAR', 'tarifa_habitacion', '1', '{\"precio\": 59000, \"etiqueta\": \"Single / Doble\"}', '{\"precio\": 590000, \"etiqueta\": \"Single / Doble\"}', '2026-04-04 03:23:13.297'),
(4, 'admin@casacerro.com', 'ACTUALIZAR', 'tarifa_habitacion', '1', '{\"precio\": 590000, \"etiqueta\": \"Single / Doble\"}', '{\"precio\": 59000, \"etiqueta\": \"Single / Doble\"}', '2026-04-04 03:23:18.951'),
(5, 'admin@casacerro.com', 'ACTUALIZAR', 'tarifa_habitacion', '1', '{\"precio\": 59000, \"etiqueta\": \"Single / Doble\"}', '{\"precio\": 590000, \"etiqueta\": \"Single / Doble\"}', '2026-04-04 03:24:42.995'),
(6, 'admin@casacerro.com', 'ACTUALIZAR', 'tarifa_habitacion', '1', '{\"precio\": 590000, \"etiqueta\": \"Single / Doble\"}', '{\"precio\": 590000, \"etiqueta\": \"Single / Doble\"}', '2026-04-04 03:35:39.406'),
(7, 'admin@casacerro.com', 'ACTUALIZAR', 'tarifa_habitacion', '1', '{\"precio\": 590000, \"etiqueta\": \"Single / Doble\"}', '{\"precio\": 59000, \"etiqueta\": \"Single / Doble\"}', '2026-04-04 03:41:11.559'),
(8, 'admin@casacerro.com', 'ACTUALIZAR', 'tarifa_habitacion', '3', '{\"precio\": 78000, \"etiqueta\": \"Cuádruple\"}', '{\"precio\": 780000, \"etiqueta\": \"Cuádruple\"}', '2026-04-04 03:41:20.016'),
(9, 'admin@casacerro.com', 'ACTUALIZAR', 'tarifa_habitacion', '3', '{\"precio\": 780000, \"etiqueta\": \"Cuádruple\"}', '{\"precio\": 78000, \"etiqueta\": \"Cuádruple\"}', '2026-04-04 03:41:22.484'),
(10, 'admin@casacerro.com', 'ACTUALIZAR', 'tarifa_habitacion', '1', '{\"precio\": 59000, \"etiqueta\": \"Single / Doble\"}', '{\"precio\": 590000, \"etiqueta\": \"Single / Doble\"}', '2026-04-05 00:33:20.126'),
(11, 'admin@casacerro.com', 'ACTUALIZAR', 'tarifa_habitacion', '1', '{\"precio\": 590000, \"etiqueta\": \"Single / Doble\"}', '{\"precio\": 59000, \"etiqueta\": \"Single / Doble\"}', '2026-04-05 14:05:56.867');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarifas_habitacion`
--

DROP TABLE IF EXISTS `tarifas_habitacion`;
CREATE TABLE IF NOT EXISTS `tarifas_habitacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_habitacion_id` int NOT NULL,
  `etiqueta` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cantidad_personas` int NOT NULL,
  `precio` int NOT NULL,
  `orden_visual` int NOT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tarifas_habitacion_tipo_habitacion_id_etiqueta_key` (`tipo_habitacion_id`,`etiqueta`),
  KEY `tarifas_habitacion_tipo_habitacion_id_idx` (`tipo_habitacion_id`),
  KEY `tarifas_habitacion_tipo_habitacion_id_orden_visual_idx` (`tipo_habitacion_id`,`orden_visual`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tarifas_habitacion`
--

INSERT INTO `tarifas_habitacion` (`id`, `tipo_habitacion_id`, `etiqueta`, `cantidad_personas`, `precio`, `orden_visual`, `creado_en`, `actualizado_en`) VALUES
(1, 1, 'Single / Doble', 2, 59000, 1, '2026-04-04 03:09:41.129', '2026-04-05 14:05:56.858'),
(2, 1, 'Triple', 3, 69000, 2, '2026-04-04 03:09:41.136', '2026-04-04 03:17:31.071'),
(3, 1, 'Cuádruple', 4, 78000, 3, '2026-04-04 03:09:41.141', '2026-04-04 03:41:22.482'),
(4, 2, 'Triple', 3, 75000, 1, '2026-04-04 03:09:41.149', '2026-04-04 03:17:31.085'),
(5, 2, 'Cuádruple', 4, 88000, 2, '2026-04-04 03:09:41.151', '2026-04-04 03:17:31.091');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_habitacion`
--

DROP TABLE IF EXISTS `tipos_habitacion`;
CREATE TABLE IF NOT EXISTS `tipos_habitacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `etiqueta` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orden_visual` int NOT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tipos_habitacion_codigo_key` (`codigo`),
  KEY `tipos_habitacion_orden_visual_idx` (`orden_visual`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tipos_habitacion`
--

INSERT INTO `tipos_habitacion` (`id`, `codigo`, `nombre`, `etiqueta`, `descripcion`, `orden_visual`, `creado_en`, `actualizado_en`) VALUES
(1, 'monoambientes', 'Monoambientes', 'Hasta 4 personas', 'Ambiente integrado con todo lo necesario para una estadía cómoda y agradable.', 1, '2026-04-04 03:09:41.118', '2026-04-04 03:17:31.050'),
(2, 'dos-ambientes', 'Dos Ambientes', 'Hasta 4 personas', 'Ambientes separados, mayor privacidad y espacio. Ideal para familias o grupos.', 2, '2026-04-04 03:09:41.145', '2026-04-04 03:17:31.081');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_administradores`
--

DROP TABLE IF EXISTS `usuarios_administradores`;
CREATE TABLE IF NOT EXISTS `usuarios_administradores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `correo_electronico` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ultimo_acceso_en` datetime(3) DEFAULT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_administradores_correo_electronico_key` (`correo_electronico`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios_administradores`
--

INSERT INTO `usuarios_administradores` (`id`, `correo_electronico`, `contrasena_hash`, `ultimo_acceso_en`, `creado_en`, `actualizado_en`) VALUES
(1, 'admin@casacerro.com', '$2b$12$X95oG4Jz6sOeOcdNUcaRkeUZnqiNcbfUqVOep4nVpzpOpPGDoBSI2', '2026-04-05 14:05:26.763', '2026-04-04 03:09:41.104', '2026-04-05 14:05:26.780');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
