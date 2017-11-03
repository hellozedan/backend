import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import autoIncrement from 'mongoose-auto-increment';
import APIError from '../helpers/APIError';


const TaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    unique: true,
    required: true
  },
  categoryName: {
    type: String
  },
  taskName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  selected: {
    type: Number,
    default: 0
  },
  order: Number

});
autoIncrement.initialize(mongoose.connection);

TaskSchema.plugin(autoIncrement.plugin, { model: 'Task', startAt: 1, field: 'taskId' });
TaskSchema.method({
});


TaskSchema.statics = {

  get(id) {
    return this.findById(id)
      .exec()
      .then((task) => {
        if (task) {
          return task;
        }
        const err = new APIError('No such task exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find({})
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};


export default mongoose.model('Task', TaskSchema);
