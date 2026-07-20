// @ts-check

const { Model, AjvValidator, snakeCaseMappers } = require('objection');
const addFormats = require('ajv-formats');

module.exports = class BaseModel extends Model {
  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv);
      },
    });
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get modelPaths() {
    return [__dirname];
  }
};
