CREATE DATABASE IF NOT EXISTS library_project;
USE library_project;

-- 1. Tabla de Roles (Catálogo: usa AUTO_INCREMENT)
CREATE TABLE IF NOT EXISTS roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar roles iniciales
INSERT IGNORE INTO roles (id_rol, nombre_rol) VALUES (1, 'Administrador'), (2, 'Cliente');

-- 2. Tabla de Usuarios (Operativa: SIN autoincremento, ID generado en Backend)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_rol INT NOT NULL,
    CONSTRAINT fk_usuarios_roles FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Categorías (Catálogo: usa AUTO_INCREMENT)
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabla de Recursos (Transaccional: SIN autoincremento, ID generado en Backend)
CREATE TABLE IF NOT EXISTS recursos (
    id_recurso INT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    url_recurso VARCHAR(500) NOT NULL,
    url_portada VARCHAR(500) NULL, -- Portada optimizada WebP
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_usuario INT NULL,
    id_categoria INT NOT NULL,
    CONSTRAINT fk_recursos_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    CONSTRAINT fk_recursos_categorias FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabla de Descargas/Visualizaciones (Transaccional: SIN autoincremento, ID generado en Backend)
CREATE TABLE IF NOT EXISTS descargas (
    id_descarga INT PRIMARY KEY,
    fecha_descarga DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_recurso INT NOT NULL,
    id_usuario INT NULL,
    CONSTRAINT fk_descargas_recursos FOREIGN KEY (id_recurso) REFERENCES recursos(id_recurso) ON DELETE CASCADE,
    CONSTRAINT fk_descargas_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
