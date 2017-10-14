import Article from '../models/article.model';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  Article.get(id)
    .then((article) => {
      req.article = article; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.article);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const article = new Article(req.body);
  article.save()
    .then(savedArticle => res.json(savedArticle))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const article = req.article;

  article.content = req.body.content;
  article.title = req.body.title;
  article.subTitle = req.body.subTitle;
  article.lastUpdated = new Date();
  article.save()
    .then(savedArticle => res.json(savedArticle))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { start = '0', limit = '20', sort = '_id', order = 'ASC' } = req.query;
  const od = (order === 'ASC') ? 1 : -1;
  const sortOD = {};
  sortOD[sort] = od;
  Article.count({})
    .then((count) => {
      res.set('X-Total-Count', count);
      Article.list({ limit, start, sortOD })
        .then(articles => res.json({ articles, count }))
        .catch(e => next(e));
    })
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const article = req.article;
  article.remove()
    .then(deletedArticle => res.json(deletedArticle))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
