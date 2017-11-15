const tasksCategories = [
  {key: '1', value: '1'},
  {key: '2', value: '2'},
  {key: 'other', value: 'other'}

];

const taskList = [
  {
    categoryName: '1',
    tasks: [
      {
        taskName: 'xxxxxxxxxx',
        selected: false,
        order: 1
      },
      {
        taskName: 'yyyyyyyy',
        selected: false,
        order: 2
      }

    ],
    order: 1
  },
  {
    categoryName: '2',
    tasks: [
      {
        taskName: 'vvvvvvvvv',
        selected: false,
        order: 1
      },
      {
        taskName: 'hhhhhhhh',
        selected: false,
        order: 2
      }

    ],
    order: 2
  },
  {
    categoryName: 'other',
    tasks: [
      {
        taskName: 'vvvvvvvvv',
        selected: false,
        order: 1
      },
      {
        taskName: 'hhhhhhhh',
        selected: false,
        order: 2
      }

    ],
    order: 3
  }

];

export default { taskList, tasksCategories };
