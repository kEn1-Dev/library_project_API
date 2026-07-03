import { Router } from 'express';
import * as recursoController from './recurso.controller';
import { authenticateJWT, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

// Categories routes
router.post('/categorias', authenticateJWT, requireRole([1]), recursoController.createCategory);
router.get('/categorias', recursoController.getAllCategories);

// Downloads routes
router.post('/descargas', recursoController.createDownload);
router.get('/:id/descargas', recursoController.getDownloadsForResource);

// Resources routes
router.post('/', authenticateJWT, recursoController.createResource);
router.get('/:id', recursoController.getResourceById);
router.get('/', recursoController.getAllResources);
router.put('/:id', authenticateJWT, recursoController.updateResource);
router.delete('/:id', authenticateJWT, recursoController.deleteResource);

export default router;
