import { Request, Response } from 'express';
import * as estadisticaService from './estadistica.service';

export const getGeneralStats = async (req: Request, res: Response) => {
  try {
    const stats = await estadisticaService.getGeneralStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Error en getGeneralStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas generales',
      error: error.message,
    });
  }
};

export const getMostDownloadedResources = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const popular = await estadisticaService.getMostDownloadedResources(limit);
    res.status(200).json({
      success: true,
      count: popular.length,
      data: popular,
    });
  } catch (error: any) {
    console.error('Error en getMostDownloadedResources:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los recursos más descargados',
      error: error.message,
    });
  }
};

export const getDownloadsByCategory = async (req: Request, res: Response) => {
  try {
    const categories = await estadisticaService.getDownloadsByCategory();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error: any) {
    console.error('Error en getDownloadsByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las descargas por categoría',
      error: error.message,
    });
  }
};
