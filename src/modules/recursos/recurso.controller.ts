import { Request, Response } from 'express';
import * as recursoService from './recurso.service';

// === Categories Controllers ===

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { nombre_categoria } = req.body;
    const result = await recursoService.createCategory(nombre_categoria);
    res.status(201).json({
      success: true,
      message: 'Categoría creada correctamente',
      insertId: result.insertId,
    });
  } catch (error: any) {
    console.error('Error en createCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la categoría',
      error: error.message,
    });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await recursoService.getAllCategories();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error: any) {
    console.error('Error en getAllCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las categorías',
      error: error.message,
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await recursoService.deleteCategory(Number(id));
    res.status(200).json({
      success: true,
      message: 'Categoría eliminada correctamente',
    });
  } catch (error: any) {
    console.error('Error en deleteCategory:', error);
    const status = error.message === 'Categoría no encontrada' ? 404 : 400;
    res.status(status).json({
      success: false,
      message: error.message || 'Error al eliminar la categoría',
    });
  }
};

// === Resources Controllers ===

export const createResource = async (req: Request, res: Response) => {
  try {
    const resourceData = {
      ...req.body,
      id_usuario: req.user?.id_usuario || req.body.id_usuario,
    };
    const result = await recursoService.createResource(resourceData);
    res.status(201).json({
      success: true,
      message: 'Recurso registrado correctamente',
      insertId: result.insertId,
    });
  } catch (error: any) {
    console.error('Error en createResource:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar el recurso',
      error: error.message,
    });
  }
};

export const getResourceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await recursoService.getResourceById(Number(id));

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error: any) {
    console.error('Error en getResourceById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el recurso',
      error: error.message,
    });
  }
};

export const getAllResources = async (req: Request, res: Response) => {
  try {
    const resources = await recursoService.getAllResources();
    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error: any) {
    console.error('Error en getAllResources:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de recursos',
      error: error.message,
    });
  }
};

export const updateResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await recursoService.getResourceById(Number(id));

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado',
      });
    }

    // Permitir solo al creador o a un Administrador
    if (req.user?.id_rol !== 1 && req.user?.id_usuario !== resource.id_usuario) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para modificar este recurso',
      });
    }

    const result = await recursoService.updateResource(Number(id), req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se realizaron cambios en el recurso',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recurso actualizado correctamente',
    });
  } catch (error: any) {
    console.error('Error en updateResource:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el recurso',
      error: error.message,
    });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await recursoService.getResourceById(Number(id));

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado',
      });
    }

    // Permitir solo al creador o a un Administrador
    if (req.user?.id_rol !== 1 && req.user?.id_usuario !== resource.id_usuario) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este recurso',
      });
    }

    const result = await recursoService.deleteResource(Number(id));

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recurso eliminado correctamente',
    });
  } catch (error: any) {
    console.error('Error en deleteResource:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el recurso',
      error: error.message,
    });
  }
};

// === Downloads Controllers ===

export const createDownload = async (req: Request, res: Response) => {
  try {
    const { id_recurso, id_usuario } = req.body;
    if (!id_recurso) {
      return res.status(400).json({
        success: false,
        message: 'El id_recurso es obligatorio',
      });
    }

    const result = await recursoService.createDownload(Number(id_recurso), id_usuario ? Number(id_usuario) : null);
    res.status(201).json({
      success: true,
      message: 'Descarga/Visualización registrada correctamente',
      insertId: result.insertId,
    });
  } catch (error: any) {
    console.error('Error en createDownload:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar la descarga',
      error: error.message,
    });
  }
};

export const getDownloadsForResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const downloads = await recursoService.getDownloadsForResource(Number(id));
    res.status(200).json({
      success: true,
      count: downloads.length,
      data: downloads,
    });
  } catch (error: any) {
    console.error('Error en getDownloadsForResource:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de descargas',
      error: error.message,
    });
  }
};
