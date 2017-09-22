import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import articlesCtrl from '../controllers/articles.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(articlesCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createArticle), articlesCtrl.create);

router.route('/:articleId')
  /** GET /api/users/:userId - Get user */
  .get(articlesCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateArticle), articlesCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(articlesCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('articleId', articlesCtrl.load);

export default router;
