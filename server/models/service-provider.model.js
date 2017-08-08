import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import autoIncrement from 'mongoose-auto-increment';
import APIError from '../helpers/APIError';


const ServiceProviderSchema = new mongoose.Schema({
  serviceProviderId: {
    type: String,
    unique: true,
    required: true
  },
  serviceProviderName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  reviews: {
    type: [{
      _id: false,
      score: Number,
      comment: String,
      userId: String
    }],
    required: false
  },
  serviceProviderDesc: {
    type: String,
    required: false
  },
  serviceProviderImagesUrl: {
    type: [],
    required: false
  },
  rating: {
    type: [{
      _id: false,
      isActive: Boolean
    }],
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  domainId: {
    type: String,
    required: true
  },
  primary: {
    type: Boolean,
    default: false,
    required: false,
  },

});
autoIncrement.initialize(mongoose.connection);

ServiceProviderSchema.plugin(autoIncrement.plugin, { model: 'ServiceProvider', startAt: 1, field: 'serviceProviderId' });

ServiceProviderSchema.method({
});


ServiceProviderSchema.statics = {

  get(id) {
    return this.findById(id)
      .exec()
      .then((serviceProvider) => {
        if (serviceProvider) {
          return serviceProvider;
        }
        const err = new APIError('No such service provider exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({ skip = 0, limit = 50, domainId, primary } = {}) {
    const query = domainId ? { domainId: domainId, } : {};
    if (primary) {
      query.primary = primary;
    }

    return this.find(query)
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};


export default mongoose.model('ServiceProvider', ServiceProviderSchema);
