import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import autoIncrement from 'mongoose-auto-increment';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  token: {
    type: String
  },
  displayName: {
    type: String
  },
  name: {
    familyName: {
      type: String
    },
    givenName: {
      type: String
    },
    middleName: {
      type: String
    }
  },
  gender: {
    type: String
  },
  photo: {
    type: String
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  mobileNumber: {
    type: String,
    match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  facebookProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(autoIncrement.plugin, { model: 'User', startAt: 1, field: 'userId' });
/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  upsertFbUser(accessToken, refreshToken, profile) {
    const That = this;
    return this.findOne({ 'facebookProvider.id': profile.id })
      .exec()
      .then((user) => {
        if (!user) {
          const newUser = new That({
            email: profile.emails[0].value,
            facebookProvider: {
              id: profile.id,
              token: accessToken
            },
            displayName: profile.displayName,
            name: profile.name,
            photo: profile.photos[0].value,
            gender: profile.gender
          });

          return newUser.save()
            .then((savedUser) => {
              if (savedUser) {
                return savedUser;
              }
              const err = new APIError('cannot save user!', httpStatus.NOT_FOUND);
              return Promise.reject(err);
            });
        }

        return user;
      });
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
