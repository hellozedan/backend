import httpStatus from 'http-status';
import Domain from '../models/domain.model';
import APIError from '../helpers/APIError';

/**
 * Load domain and append to req.
 */
function load(req, res, next, id) {
  Domain.findOne({ domainId: id })
    .then((domain) => {
      if (!domain) {
        const err = new APIError('Not Found', httpStatus.NOT_FOUND, true);
        return next(err);
      }

      req.domain = domain; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get domain
 * @returns {Domain}
 */
function get(req, res) {
  return res.json(req.domain);
}

/**
 * Create new domain
 * @property {string} req.body.domainName - The domainName of domain.
 * @property {string} req.body.mobileNumber - The mobileNumber of domain.
 * @returns {Domain}
 */
function create(req, res, next) {
  const domain = new Domain({
    domainName: req.body.domainName,
    domainLogo: req.body.domainLogo,
    level: req.body.level,
    parentId: req.body.parentId
  });

  domain.save()
    .then(savedDomain => res.json(savedDomain))
    .catch(e => next(e));
}

/**
 * Update existing domain
 * @property {string} req.body.domainName - The domainName of domain.
 * @property {string} req.body.mobileNumber - The mobileNumber of domain.
 * @returns {Domain}
 */
function update(req, res, next) {
  /**
   TODO: validate parameters, check if sub domain has parent domain, check if levels are correct
   */
  const domain = req.domain;
  domain.domainName = req.body.domainName;
  domain.domainLogo = req.body.domainLogo;
  domain.level = req.body.level;
  domain.parentId = req.body.parentId;
  domain.isParent = req.body.isParent;

  domain.save()
    .then(savedDomain => res.json(savedDomain))
    .catch(e => next(e));
}

/**
 * Get domain list.
 * @property {number} req.query.skip - Number of domains to be skipped.
 * @property {number} req.query.limit - Limit number of domains to be returned.
 * @returns {Domain[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0, level = 1, parentId } = req.query;
  Domain.list({ limit, skip, level, parentId })
    .then(domains => res.json(domains))
    .catch(e => next(e));
}

/**
 * Delete domain.
 * @returns {Domain}
 */
function remove(req, res, next) {
  const domain = req.domain;
  domain.remove()
    .then(deletedDomain => res.json(deletedDomain))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
