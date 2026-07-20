// @ts-check
// Маршруты CRUD меток.

import i18next from 'i18next';

export default (app) => {
  const LabelModel = app.objection.models.label;

  app
    .get('/labels', { name: 'labels', preValidation: app.authenticate }, async (req, reply) => {
      const labels = await LabelModel.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { name: 'newLabel', preValidation: app.authenticate }, (req, reply) => {
      const label = new LabelModel();
      reply.render('labels/new', { label });
    })
    .post('/labels', { preValidation: app.authenticate }, async (req, reply) => {
      const label = new LabelModel();
      label.$set(req.body.data);

      try {
        const validLabel = await LabelModel.fromJson(req.body.data);
        await LabelModel.query().insert(validLabel);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label, errors: data });
      }

      return reply;
    })
    .get('/labels/:id/edit', {
      name: 'editLabel',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const label = await LabelModel.query().findById(req.params.id);
      reply.render('labels/edit', { label });
      return reply;
    })
    .patch('/labels/:id', {
      name: 'oneLabel',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const label = await LabelModel.query().findById(req.params.id);

      try {
        const validLabel = await LabelModel.fromJson(req.body.data);
        await label.$query().patch(validLabel);
        req.flash('info', i18next.t('flash.labels.edit.success'));
        reply.redirect(app.reverse('labels'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.edit.error'));
        reply.render('labels/edit', { label, errors: data });
      }

      return reply;
    })
    .delete('/labels/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const label = await LabelModel.query().findById(req.params.id);
      const relatedTasks = await label.$relatedQuery('tasks');

      if (relatedTasks.length) {
        req.flash('error', i18next.t('flash.labels.delete.error'));
        reply.redirect(app.reverse('labels'));
        return reply;
      }

      try {
        await label.$query().delete();
        req.flash('info', i18next.t('flash.labels.delete.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.labels.delete.error'));
      }

      reply.redirect(app.reverse('labels'));
      return reply;
    });
};
