import db from '../../config/db';
import { generateRecursoId, generateDescargaId } from '../utils/ids';

export interface ResourceData {
  id_recurso?: number;
  titulo: string;
  descripcion?: string;
  url_recurso: string;
  url_portada?: string;
  id_usuario?: number;
  id_categoria: number;
}

// === Categories (categorias) Operations ===

export const createCategory = async (nombre_categoria: string): Promise<any> => {
  if (!nombre_categoria) {
    throw new Error('El nombre de la categoría es obligatorio');
  }

  const [result]: any = await db.query(
    'INSERT INTO categorias (nombre_categoria) VALUES (?)',
    [nombre_categoria]
  );

  return {
    insertId: result.insertId,
    affectedRows: result.affectedRows,
  };
};

export const getAllCategories = async (): Promise<any[]> => {
  const [rows]: any = await db.query(
    'SELECT * FROM categorias ORDER BY nombre_categoria ASC'
  );
  return rows;
};

// === Resources (recursos) Operations ===

export const createResource = async (resourceData: ResourceData): Promise<any> => {
  const id_recurso = generateRecursoId();
  const { titulo, descripcion, url_recurso, url_portada, id_usuario, id_categoria } = resourceData;

  if (!titulo || !url_recurso || id_categoria === undefined) {
    throw new Error('El título, la URL del recurso y la categoría son obligatorios');
  }

  // 1. Validar que el id_recurso no exista (por colisión)
  const [existingId]: any = await db.query(
    'SELECT id_recurso FROM recursos WHERE id_recurso = ?',
    [id_recurso]
  );

  if (existingId.length > 0) {
    return createResource(resourceData);
  }

  const [result]: any = await db.query(
    `INSERT INTO recursos (id_recurso, titulo, descripcion, url_recurso, url_portada, id_usuario, id_categoria) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id_recurso,
      titulo,
      descripcion || null,
      url_recurso,
      url_portada || null,
      id_usuario || null,
      id_categoria,
    ]
  );

  return {
    insertId: id_recurso,
    affectedRows: result.affectedRows,
  };
};

export const getResourceById = async (id_recurso: number): Promise<any> => {
  const [rows]: any = await db.query(
    `SELECT r.*, c.nombre_categoria, u.nombre as nombre_creador 
     FROM recursos r
     INNER JOIN categorias c ON r.id_categoria = c.id_categoria
     LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
     WHERE r.id_recurso = ?`,
    [id_recurso]
  );
  return rows[0];
};

export const getAllResources = async (): Promise<any[]> => {
  const [rows]: any = await db.query(
    `SELECT r.*, c.nombre_categoria, u.nombre as nombre_creador 
     FROM recursos r
     INNER JOIN categorias c ON r.id_categoria = c.id_categoria
     LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
     ORDER BY r.id_recurso DESC`
  );
  return rows;
};

export const updateResource = async (id_recurso: number, resourceData: Partial<ResourceData>): Promise<any> => {
  const { titulo, descripcion, url_recurso, url_portada, id_usuario, id_categoria } = resourceData;

  const updates: string[] = [];
  const values: any[] = [];

  if (titulo !== undefined) {
    updates.push('titulo = ?');
    values.push(titulo);
  }
  if (descripcion !== undefined) {
    updates.push('descripcion = ?');
    values.push(descripcion);
  }
  if (url_recurso !== undefined) {
    updates.push('url_recurso = ?');
    values.push(url_recurso);
  }
  if (url_portada !== undefined) {
    updates.push('url_portada = ?');
    values.push(url_portada);
  }
  if (id_usuario !== undefined) {
    updates.push('id_usuario = ?');
    values.push(id_usuario);
  }
  if (id_categoria !== undefined) {
    updates.push('id_categoria = ?');
    values.push(id_categoria);
  }

  if (updates.length === 0) {
    throw new Error('No hay campos para actualizar');
  }

  values.push(id_recurso);

  const [result]: any = await db.query(
    `UPDATE recursos SET ${updates.join(', ')} WHERE id_recurso = ?`,
    values
  );

  return {
    affectedRows: result.affectedRows,
  };
};

export const deleteResource = async (id_recurso: number): Promise<any> => {
  const [result]: any = await db.query(
    'DELETE FROM recursos WHERE id_recurso = ?',
    [id_recurso]
  );
  return {
    affectedRows: result.affectedRows,
  };
};

// === Downloads (descargas) Operations ===

export const createDownload = async (id_recurso: number, id_usuario: number | null): Promise<any> => {
  const id_descarga = generateDescargaId();

  // Validar colisión
  const [existingId]: any = await db.query(
    'SELECT id_descarga FROM descargas WHERE id_descarga = ?',
    [id_descarga]
  );

  if (existingId.length > 0) {
    return createDownload(id_recurso, id_usuario);
  }

  const [result]: any = await db.query(
    `INSERT INTO descargas (id_descarga, id_recurso, id_usuario) 
     VALUES (?, ?, ?)`,
    [id_descarga, id_recurso, id_usuario]
  );

  return {
    insertId: id_descarga,
    affectedRows: result.affectedRows,
  };
};

export const getDownloadsForResource = async (id_recurso: number): Promise<any[]> => {
  const [rows]: any = await db.query(
    `SELECT d.*, u.nombre as nombre_usuario 
     FROM descargas d
     LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
     WHERE d.id_recurso = ?
     ORDER BY d.fecha_descarga DESC`,
    [id_recurso]
  );
  return rows;
};
