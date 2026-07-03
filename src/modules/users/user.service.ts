import db from '../../config/db';
import bcrypt from 'bcryptjs';
import { generateUsuarioId } from '../utils/ids';

export interface UserData {
  id_usuario?: number;
  nombre: string;
  correo: string;
  contrasena: string;
  id_rol: number;
}

export const createUser = async (userData: UserData): Promise<any> => {
  const id_usuario = generateUsuarioId();
  const { nombre, correo, contrasena, id_rol } = userData;

  if (!nombre || !correo || !contrasena || id_rol === undefined) {
    throw new Error('Todos los campos (nombre, correo, contrasena, id_rol) son obligatorios');
  }

  // 1. Validar que el correo no exista
  const [existingEmail]: any = await db.query(
    'SELECT id_usuario FROM usuarios WHERE correo = ?',
    [correo]
  );

  if (existingEmail.length > 0) {
    throw new Error('El correo electrónico ya está registrado');
  }

  // 2. Validar que el id_usuario no exista (por colisión)
  const [existingId]: any = await db.query(
    'SELECT id_usuario FROM usuarios WHERE id_usuario = ?',
    [id_usuario]
  );

  if (existingId.length > 0) {
    // Si hay colisión, re-intentamos
    return createUser(userData);
  }

  // Encriptar contraseña
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  // Insertar usuario con el id_usuario generado
  const [result]: any = await db.query(
    `INSERT INTO usuarios (id_usuario, nombre, correo, contrasena_hash, id_rol) 
     VALUES (?, ?, ?, ?, ?)`,
    [id_usuario, nombre, correo, hashedPassword, id_rol]
  );

  return {
    insertId: id_usuario,
    affectedRows: result.affectedRows,
  };
};

export const findUserByEmail = async (correo: string): Promise<any> => {
  const [rows]: any = await db.query(
    'SELECT * FROM usuarios WHERE correo = ?',
    [correo]
  );
  return rows[0];
};

export const findUserById = async (id_usuario: number): Promise<any> => {
  const [rows]: any = await db.query(
    `SELECT id_usuario, nombre, correo, id_rol, fecha_registro 
     FROM usuarios 
     WHERE id_usuario = ?`,
    [id_usuario]
  );
  return rows[0];
};

export const getAllUsers = async (): Promise<any[]> => {
  const [rows]: any = await db.query(
    `SELECT id_usuario, nombre, correo, id_rol, fecha_registro 
     FROM usuarios 
     ORDER BY id_usuario DESC`
  );
  return rows;
};
