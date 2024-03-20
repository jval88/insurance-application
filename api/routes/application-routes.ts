import { Router } from 'express';

import * as Controllers from '../controllers/application';
import { putChecks, submitChecks } from '../common/validators/validationChecks';

const routes = Router();

routes.post('/', Controllers.createApplication);

routes.get('/:id', Controllers.getApplication);

routes.put('/:id', putChecks, Controllers.updateApplication);

routes.post('/:id/submit', submitChecks, Controllers.validateAndUpdateApplication);

export default routes;
