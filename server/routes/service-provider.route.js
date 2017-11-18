import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import serviceProviderCtrl from '../controllers/service-provider.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/serviceProviders - Get list of serviceProviders */
  .get(config.authenticate, serviceProviderCtrl.getCurrentUserWhenItNeed, serviceProviderCtrl.list)

  /** POST /api/serviceProviders - Create new serviceProvider */
  .post(validate(paramValidation.createServiceProvider), serviceProviderCtrl.create);

router.route('/getAllforAdmin')
/** GET /api/serviceProviders/getAllforAdmin - Get list of serviceProvider */
  .get(serviceProviderCtrl.getAllforAdmin);
router.route('/getAreasList')
  /* /api/serviceProviders/getAreasList   */
  .get(serviceProviderCtrl.getAreasList);
router.route('/:serviceProviderId')
/** GET /api/serviceProviders/:serviceProviderId - Get serviceProvider */
  .get(serviceProviderCtrl.get)

  /** PUT /api/serviceProviders/:serviceProviderId - Update serviceProvider */
  .put(validate(paramValidation.updateServiceProvider), config.authenticate, serviceProviderCtrl.update)

  /** DELETE /api/serviceProviders/:serviceProviderId - Delete serviceProvider */
  .delete(serviceProviderCtrl.remove);

/** Load serviceProvider when API with serviceProviderId route parameter is hit */
router.param('serviceProviderId', serviceProviderCtrl.load);

export default router;
