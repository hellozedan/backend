import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/domains
  createDomain: {
    body: {
      domainName: Joi.string().required(),
      domainLogo: Joi.string().required()
    }
  },

  // UPDATE /api/domains/:domainId
  updateDomain: {
    body: {
      domainName: Joi.string().required(),
      domainLogo: Joi.string().required(),
    },
    params: {
      domainId: Joi.string().hex().required()
    }
  },

  // POST /api/serviceProviders
  createServiceProvider: {
    body: {
      serviceProviderName: Joi.string().required(),
      serviceProviderDesc: Joi.string().required(),
      serviceProviderImagesUrl: Joi.array().required(),
      domainId: Joi.string().required(),
    }
  },

  // UPDATE /api/serviceProviders/:serviceProviderId
  updateServiceProvider: {
    body: {
      serviceProviderName: Joi.string().required(),
      serviceProviderDesc: Joi.string().required(),
      serviceProviderImagesUrl: Joi.array().required(),
      domainId: Joi.string().required(),
    },
    params: {
      serviceProviderId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
