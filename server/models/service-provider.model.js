import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import autoIncrement from 'mongoose-auto-increment';
import APIError from '../helpers/APIError';
import areas from '../data/areas.data';


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
  area: {
    type: String,
    enum: areas,
    required: true
  },
  reviews: {
    type: [{
      _id: false,
      score: Number,
      comment: String,
      user: {
        userId: String,
        displayName: String,
        photo: String
      }
    }],
    required: false
  },
  ratingScore: {
    type: Number,
    default: 0
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
  },
  primary: {
    type: Boolean,
    default: false,
    required: false,
  },
  defaultReview: {
    type: String,
    default: ''
  }

});
autoIncrement.initialize(mongoose.connection);

ServiceProviderSchema.plugin(autoIncrement.plugin, {model: 'ServiceProvider', startAt: 1, field: 'serviceProviderId'});

ServiceProviderSchema.method({});


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

  list: function ({ skip = 0, limit = 50, domainId, primary, filter, byFavorite, favoritesServiceProviders } = {}) {
    const query = domainId ? {domainId} : {};
    let SortBy = {createdAt: -1};
    if (primary) {
      query.primary = primary;
    }
    if (filter) {
      filter = JSON.parse(filter);
    }
    if (filter && filter.area) {
      query.area = filter.area;
    }
    if (filter && filter.toOrderBy) {
      SortBy = {ratingScore: -1};
    }
    if (filter && filter.SPName) {
      query.serviceProviderName = {'$regex': filter.SPName, '$options': 'i'};
    }
    if(byFavorite && favoritesServiceProviders.length > 0){
      query.serviceProviderId = { $in: favoritesServiceProviders };
    }

    return this.find(query)
      .sort(SortBy)
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};


export default mongoose.model('ServiceProvider', ServiceProviderSchema);
