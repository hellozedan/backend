import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import ServiceProvider from '../models/service-provider.model';

/**
 * Load service provider and append to req.
 */
function load(req, res, next, id) {
  ServiceProvider.findOne({ serviceProviderId: id })
    .then((serviceProvider) => {
      if (!serviceProvider) {
        const err = new APIError('Not Found', httpStatus.NOT_FOUND, true);
        return next(err);
      }

      req.serviceProvider = serviceProvider; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get service provider
 * @returns {ServiceProvider}
 */
function get(req, res) {
  return res.json(req.serviceProvider);
}

/**
 * Create new service provider
 * @property {string} req.body.serviceProviderName - The service provider name of ServiceProvider.
 * @property {array} req.body.serviceProviderImagesUrl.
 * @returns {ServiceProvider}
 */
function create(req, res, next) {
  /**
    TODO: check if domain is exist
   */
  const serviceProvider = new ServiceProvider({
    serviceProviderName: req.body.serviceProviderName,
    serviceProviderDesc: req.body.serviceProviderDesc,
    serviceProviderImagesUrl: req.body.serviceProviderImagesUrl,
    address: req.body.address,
    reviews: req.body.reviews,
    primary: req.body.primary,
    domainId: req.body.domainId
  });

  serviceProvider.save()
    .then(savedServiceProvider => res.json(savedServiceProvider))
    .catch(e => next(e));
}

/**
 * Update existing serviceProvider
 * @property {string} req.body.serviceProviderName - The service provider name of ServiceProvider.
 * @property {array} req.body.serviceProviderImagesUrl.
 * @returns {ServiceProvider}
 */
function update(req, res, next) {
  /**
   TODO: check if domain is exist
   */
  const serviceProvider = req.serviceProvider;
  serviceProvider.serviceProviderName = req.body.serviceProviderName;
  serviceProvider.serviceProviderDesc = req.body.serviceProviderDesc;
  serviceProvider.serviceProviderImagesUrl = req.body.serviceProviderImagesUrl;
  serviceProvider.address = req.body.address;
  serviceProvider.reviews = req.body.reviews;
  serviceProvider.primary = req.body.primary;
  serviceProvider.domainId = req.body.domainId;

  serviceProvider.save()
    .then(savedServiceProvider => res.json(savedServiceProvider))
    .catch(e => next(e));
}

/**
 * Get serviceProvider list.
 * @property {number} req.query.skip - Number of serviceProviders to be skipped.
 * @property {number} req.query.limit - Limit number of serviceProviders to be returned.
 * @returns {ServiceProvider[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0, domainId, primary } = req.query;
  ServiceProvider.list({ limit, skip, domainId, primary })
    .then(serviceProviders => res.json(serviceProviders))
    .catch(e => next(e));
}

/**
 * Delete serviceProvider.
 * @returns {ServiceProvider}
 */
function remove(req, res, next) {
  const serviceProvider = req.serviceProvider;
  serviceProvider.remove()
    .then(deletedServiceProvider => res.json(deletedServiceProvider))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
