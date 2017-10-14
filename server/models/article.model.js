import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import autoIncrement from 'mongoose-auto-increment';
import APIError from '../helpers/APIError';

/**
 *ArticleSchema
 */
const ArticleSchema = new mongoose.Schema({
  articleId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subTitle: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number
  }
});

autoIncrement.initialize(mongoose.connection);
ArticleSchema.plugin(autoIncrement.plugin, { model: 'Article', startAt: 1, field: 'articleId' });
/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
ArticleSchema.method({
});

/**
 * Statics
 */
ArticleSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((article) => {
        if (article) {
          return article;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} start - Number of users to be skipped.
   * @param {number} sortOD - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ start = 0, limit = 50, sortOD = { createdAt: -1 } } = {}) {
    return this.find()
      .sort(+sortOD)
      .skip(+start)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('Article', ArticleSchema);
