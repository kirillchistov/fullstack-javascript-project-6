// @ts-check
// Маршруты CRUD статусов задач.

import i18next from 'i18next';

export default (app) => {
  const TaskStatusModel = app.objection.models.taskStatus;

  app
    .get('/statuses', { name: 'statuses', preValidation: app.authenticate }, async (req, reply) => {
      const statuses = await TaskStatusModel.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus', preValidation: app.authenticate }, (req, reply) => {
      const status = new TaskStatusModel();
      reply.render('statuses/new', { status });
    })
    .post('/statuses', { preValidation: app.authenticate }, async (req, reply) => {
      const status = new TaskStatusModel();
      status.$set(req.body.data);

      try {
        const validStatus = await TaskStatusModel.fromJson(req.body.data);
        await TaskStatusModel.query().insert(validStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: data });
      }

      return reply;
    })
    .get('/statuses/:id/edit', {
      name: 'editStatus',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const status = await TaskStatusModel.query().findById(req.params.id);
      reply.render('statuses/edit', { status });
      return reply;
    })
    .patch('/statuses/:id', {
      name: 'oneStatus',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const status = await TaskStatusModel.query().findById(req.params.id);

      try {
        const validStatus = await TaskStatusModel.fromJson(req.body.data);
        await status.$query().patch(validStatus);
        req.flash('info', i18next.t('flash.statuses.edit.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.edit.error'));
        reply.render('statuses/edit', { status, errors: data });
      }

      return reply;
    })
    .delete('/statuses/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const status = await TaskStatusModel.query().findById(req.params.id);
      const relatedTasks = await status.$relatedQuery('tasks');

      if (relatedTasks.length) {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        reply.redirect(app.reverse('statuses'));
        return reply;
      }

      try {
        await TaskStatusModel.query().deleteById(Number(req.params.id));
        req.flash('info', i18next.t('flash.statuses.delete.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
      }

      reply.redirect(app.reverse('statuses'));
      return reply;
    });
};
