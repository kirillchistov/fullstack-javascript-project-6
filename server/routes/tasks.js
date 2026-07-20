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

const getLabelIds = (labels) => {
  if (!labels) {
    return [];
  }

  return [].concat(labels).map(Number).filter(Boolean);
};

export default (app) => {
  const TaskModel = app.objection.models.task;
  const TaskStatusModel = app.objection.models.taskStatus;
  const UserModel = app.objection.models.user;
  const LabelModel = app.objection.models.label;

  const getFormData = async () => {
    const [statuses, users, labels] = await Promise.all([
      TaskStatusModel.query(),
      UserModel.query(),
      LabelModel.query(),
    ]);

    return { statuses, users, labels };
  };

  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const {
        statuses, users, labels,
      } = await getFormData();

      const selection = Object.fromEntries(
        Object.entries(req.query)
          .filter(([, value]) => value !== '' && !Number.isNaN(Number(value)))
          .map(([key, value]) => ([key, Number(value)])),
      );

      if (req.query?.isCreatorUser === 'on') {
        selection.creator = req.user.id;
      }

      const {
        executor, label, status, creator,
      } = selection;

      const tasks = await TaskModel.query()
        .skipUndefined()
        .where('statusId', status)
        .where('executorId', executor)
        .where('creatorId', creator)
        .withGraphJoined('[labels]')
        .where('labelId', label);

      await Promise.all(
        tasks.map((task) => task.$fetchGraph('[status, creator, executor, labels]')),
      );

      reply.render('tasks/index', {
        tasks, statuses, users, labels, selection,
      });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = new TaskModel();
      const {
        statuses, users, labels,
      } = await getFormData();
      reply.render('tasks/new', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .post('/tasks', { preValidation: app.authenticate }, async (req, reply) => {
      const task = new TaskModel();
      task.$set(req.body.data);
      const {
        statuses, users, labels,
      } = await getFormData();
      const labelIds = getLabelIds(req.body.data.labels);

      try {
        const validTask = await TaskModel.fromJson(
          parseTaskData(req.body.data, req.user.id),
        );

        await TaskModel.transaction(async (trx) => {
          const newTask = await TaskModel.query(trx).insert(validTask);
          await Promise.all(
            labelIds.map((labelId) => newTask.$relatedQuery('labels', trx).relate(labelId)),
          );
        });

        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', {
          task, statuses, users, labels, errors: data,
        });
      }

      return reply;
    })
    .get('/tasks/:id', { name: 'showTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = await TaskModel.query()
        .findById(req.params.id)
        .withGraphFetched('[status, creator, executor, labels]');
      reply.render('tasks/show', { task });
      return reply;
    })
    .get('/tasks/:id/edit', {
      name: 'editTask',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const task = await TaskModel.query()
        .findById(req.params.id)
        .withGraphFetched('labels');
      task.labels = task.labels.map(({ id }) => id);
      const {
        statuses, users, labels,
      } = await getFormData();
      reply.render('tasks/edit', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .patch('/tasks/:id', {
      name: 'oneTask',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const task = await TaskModel.query().findById(req.params.id);
      const {
        statuses, users, labels,
      } = await getFormData();
      const labelIds = getLabelIds(req.body.data.labels);

      try {
        const validTask = await TaskModel.fromJson(
          parseTaskData(req.body.data, task.creatorId),
        );

        await TaskModel.transaction(async (trx) => {
          await task.$query(trx).patch(validTask);
          await task.$relatedQuery('labels', trx).unrelate();
          await Promise.all(
            labelIds.map((labelId) => task.$relatedQuery('labels', trx).relate(labelId)),
          );
        });

        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.render('tasks/edit', {
          task, statuses, users, labels, errors: data,
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
