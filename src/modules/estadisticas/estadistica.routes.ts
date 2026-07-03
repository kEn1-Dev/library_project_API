import { Router } from 'express';
import * as estadisticaController from './estadistica.controller';
import { authenticateJWT } from '../../middlewares/auth.middleware';

const router = Router();

// Protect all stats endpoints with JWT authentication
router.use(authenticateJWT);

router.get('/general', estadisticaController.getGeneralStats);
router.get('/populares', estadisticaController.getMostDownloadedResources);
router.get('/categorias', estadisticaController.getDownloadsByCategory);

export default router;
