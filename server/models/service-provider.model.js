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
  serviceProviderDesc: {
    type: String,
    required: false
  },
  serviceProviderImagesUrl: {
    type: [],
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  domainId: {
    type: String,
    required: true
  }

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

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};


export default mongoose.model('ServiceProvider', ServiceProviderSchema);
