import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import User from '../models/user.model';
import config from '../../config/config';
import taskData from '../data/tasks.data';

function getCurrentUser(req, res, next) {
  User.get(req.auth.id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

function getOne(req, res) {
  const user = req.user.toObject();
  delete user.facebookProvider;
  delete user._id;
  delete user.__v;

  res.json(user);
}

function getTasks(req, res) {
  const user = req.user.toObject();
  res.json({ tasks: user.tasks, tasksCategories: taskData.tasksCategories });
}


/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}


function createToken(auth) {
  return jwt.sign(
    { id: auth.id },
    config.jwtSecret,
    { expiresIn: 60 * 12000 } //seconds
  );
}

function sendToken(req, res) {
  res.setHeader('x-auth-token', req.token);
  res.status(200).send();
}


function generateToken(req, res, next) {
  req.token = createToken(req.auth); // eslint-disable-line no-param-reassign
  next();
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  if (!req.user) {
    const err = new APIError('User Not Authenticated', httpStatus.UNAUTHORIZED, true);
    return next(err);
  }

  req.auth = { id: req.user.id }; // eslint-disable-line no-param-reassign
  return next();
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  const details = req.body;
  delete details.userId;

  Object.assign(user, details);
  user.save()
    .then(savedUser => next())
    .catch(e => {
      next(e);
    });
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default {
  get,
  create,
  update,
  list,
  remove,
  generateToken,
  sendToken,
  getCurrentUser,
  getOne,
  getTasks
};
