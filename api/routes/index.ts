import { Router } from 'express';

import applicationRoutes from './application-routes';

const routes = Router();

routes.use('/applications', applicationRoutes);

export default routes;
