import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import ServiceProvider from '../models/service-provider.model';
import areas from '../data/areas.data';

/**
 * Load service provider and append to req.
 */
function load(req, res, next, id) {
  ServiceProvider.findOne({serviceProviderId: id})
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

function getAreasList(req, res) {
  return res.json(areas);
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
  const details = req.body;
  delete details.serviceProviderId;
  delete details.domainId;

  Object.assign(serviceProvider, req.body);


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
  const {limit = 50, skip = 0, domainId, primary} = req.query;
  ServiceProvider.list({limit, skip, domainId, primary})
    .then(serviceProviders => res.json(serviceProviders))
    .catch(e => next(e));
}


function getAllforAdmin(req, res, next) {
  const {start = '0', limit = '20', sort = '_id', order = 'ASC'} = req.query;
  const od = (order === 'ASC') ? 1 : -1;
  const sortOD = {};
  sortOD[sort] = od;
  ServiceProvider.count({})
    .then((count) => {
      res.set('X-Total-Count', count);
      ServiceProvider.list({limit, start, sortOD})
        .then(serviceProviders => res.json({serviceProviders, count}))
        .catch(e => next(e));
    }).catch(e => next(e));
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

export default {load, get, create, update, list, getAllforAdmin, remove, getAreasList };
