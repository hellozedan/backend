import express from 'express';
import passport from 'passport';
import userCtrl from '../controllers/user.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/auth/facebook')
 /** POST /api/users - Create new user */
  .post(passport.authenticate('facebook-token', { session: false }), userCtrl.create, userCtrl.generateToken, userCtrl.sendToken);

router.route('/tasks')
/** GET /api/users/tasks - Get user tasks */
  .get(config.authenticate, userCtrl.getCurrentUser, userCtrl.getTasks);

router.route('/auth/me')
  .get(config.authenticate, userCtrl.getCurrentUser, userCtrl.getOne);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(config.authenticate, userCtrl.getCurrentUser)

  /** PUT /api/users/:userId - Update user */
  .put(userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);

export default router;
