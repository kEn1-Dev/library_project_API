import { Request, Response } from 'express';
import * as userService from './user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_super_secret_jwt_key_12345';

export const register = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      insertId: result.insertId,
    });
  } catch (error: any) {
    console.error('Error en register:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar el usuario',
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son requeridos',
      });
    }

    const user = await userService.findUserByEmail(correo);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        correo: user.correo,
        id_rol: user.id_rol,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userResponse = {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      id_rol: user.id_rol,
      fecha_registro: user.fecha_registro,
    };

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: userResponse,
    });
  } catch (error: any) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor durante el login',
      error: error.message,
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const id_usuario = req.user?.id_usuario || req.body.id_usuario || req.headers['x-user-id'];

    if (!id_usuario) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere el ID del usuario',
      });
    }

    const user = await userService.findUserById(Number(id_usuario));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Error en getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil',
      error: error.message,
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    console.error('Error en getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de usuarios',
      error: error.message,
    });
  }
};
