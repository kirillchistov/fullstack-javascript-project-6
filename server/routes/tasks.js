// @ts-check
// Маршруты CRUD задач.

import i18next from 'i18next';

const parseTaskData = (data, creatorId) => ({
  name: data.name,
  description: data.description || '',
  statusId: Number(data.statusId),
  creatorId,
  executorId: data.executorId ? Number(data.executorId) : null,
});

export default (app) => {
  const TaskModel = app.objection.models.task;
  const TaskStatusModel = app.objection.models.taskStatus;
  const UserModel = app.objection.models.user;

  const getFormData = async () => {
    const [statuses, users] = await Promise.all([
      TaskStatusModel.query(),
      UserModel.query(),
    ]);

    return { statuses, users };
  };

  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const tasks = await TaskModel.query()
        .withGraphFetched('[status, creator, executor]');
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = new TaskModel();
      const { statuses, users } = await getFormData();
      reply.render('tasks/new', { task, statuses, users });
      return reply;
    })
    .post('/tasks', { preValidation: app.authenticate }, async (req, reply) => {
      const task = new TaskModel();
      task.$set(req.body.data);
      const { statuses, users } = await getFormData();

      try {
        const validTask = await TaskModel.fromJson(
          parseTaskData(req.body.data, req.user.id),
        );
        await TaskModel.query().insert(validTask);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', {
          task, statuses, users, errors: data,
        });
      }

      return reply;
    })
    .get('/tasks/:id', { name: 'showTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = await TaskModel.query()
        .findById(req.params.id)
        .withGraphFetched('[status, creator, executor]');
      reply.render('tasks/show', { task });
      return reply;
    })
    .get('/tasks/:id/edit', {
      name: 'editTask',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const task = await TaskModel.query().findById(req.params.id);
      const { statuses, users } = await getFormData();
      reply.render('tasks/edit', { task, statuses, users });
      return reply;
    })
    .patch('/tasks/:id', {
      name: 'oneTask',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const task = await TaskModel.query().findById(req.params.id);
      const { statuses, users } = await getFormData();

      try {
        const validTask = await TaskModel.fromJson(
          parseTaskData(req.body.data, task.creatorId),
        );
        await task.$query().patch(validTask);
        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.render('tasks/edit', {
          task, statuses, users, errors: data,
        });
      }

      return reply;
    })
    .delete('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const task = await TaskModel.query().findById(req.params.id);

      if (task.creatorId !== req.user.id) {
        req.flash('error', i18next.t('flash.tasks.delete.accessError'));
      } else {
        try {
          await task.$query().delete();
          req.flash('info', i18next.t('flash.tasks.delete.success'));
        } catch (e) {
          req.flash('error', i18next.t('flash.tasks.delete.error'));
        }
      }

      reply.redirect(app.reverse('tasks'));
      return reply;
    });
};
