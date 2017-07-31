import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import autoIncrement from 'mongoose-auto-increment';
import APIError from '../helpers/APIError';


const DomainSchema = new mongoose.Schema({
  domainId: {
    type: String,
    unique: true,
    required: true
  },
  domainName: {
    type: String,
    unique: true,
    required: true
  },
  domainLogo: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
autoIncrement.initialize(mongoose.connection);

DomainSchema.plugin(autoIncrement.plugin, { model: 'Domain', startAt: 1, field: 'domainId' });

DomainSchema.method({
});


DomainSchema.statics = {

  get(id) {
    return this.findById(id)
      .exec()
      .then((domain) => {
        if (domain) {
          return domain;
        }
        const err = new APIError('No such domain exists!', httpStatus.NOT_FOUND);
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


export default mongoose.model('Domain', DomainSchema);
