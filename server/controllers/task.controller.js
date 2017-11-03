import httpStatus from 'http-status';
import Task from '../models/task.model';
import APIError from '../helpers/APIError';

/**
 * Load task and append to req.
 */
function load(req, res, next, id) {
  Task.findOne({ taskId: id })
    .then((task) => {
      if (!task) {
        const err = new APIError('Not Found', httpStatus.NOT_FOUND, true);
        return next(err);
      }

      req.task = task; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get task
 * @returns {Task}
 */
function get(req, res) {
  return res.json(req.task);
}

/**
 * Create new task
 * @property {string} req.body.categoryName - The categoryName of task.
 * @property {string} req.body.mobileNumber - The mobileNumber of task.
 * @returns {Task}
 */
function create(req, res, next) {
  const task = new Task({
    categoryName: req.body.categoryName,
    taskName: req.body.taskName,
    order: req.body.order
  });

  task.save()
    .then(savedTask => res.json(savedTask))
    .catch(e => next(e));
}

/**
 * Update existing task
 * @property {string} req.body.categoryName - The categoryName of task.
 * @property {string} req.body.mobileNumber - The mobileNumber of task.
 * @returns {Task}
 */
function update(req, res, next) {
  const task = req.task;

  task.categoryName = req.body.categoryName;
  task.taskName = req.body.taskName;
  task.order = req.body.order;

  task.save()
    .then(savedTask => res.json(savedTask))
    .catch(e => next(e));
}

/**
 * Get task list.
 * @property {number} req.query.skip - Number of tasks to be skipped.
 * @property {number} req.query.limit - Limit number of tasks to be returned.
 * @returns {Task[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Task.list({ limit, skip })
    .then(tasks => res.json(tasks))
    .catch(e => next(e));
}

/**
 * Delete task.
 * @returns {Task}
 */
function remove(req, res, next) {
  const task = req.task;
  task.remove()
    .then(deletedTask => res.json(deletedTask))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
