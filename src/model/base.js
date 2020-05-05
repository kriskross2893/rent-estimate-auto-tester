import _ from 'lodash';

const getTableName = (modelName) => {
  return modelName.replace(
    /([a-z])([A-Z])/g,
    (m) => `${m[0]}_${m[1]}.toLowerCase()`
  ).toLowerCase();
};

const createModel = (modelName, fields, options) => {
  const {
    tableName,
    schema,
    associate,
    freezeTableName,
    constants,
  } = {
    ...{
      schema: process.env.CAST_SCHEMA,
      freezeTableName: true,
    },
    ...options
  };

  return (sequelize, types) => {
    const realTableName = (tableName) ? tableName : getTableName(modelName);

    const model = sequelize.define(
      modelName, {
        ...fields(types, sequelize),
      }, {
        ...options,
        ...{
          table: realTableName,
          freezeTableName,
          schema,
          timestamps: false,
        },
      },
    );

    model.associate = (associate)
      ? db => associate(model, db)
      : null;

    Object.assign(model, constants);

    model.findByID = model.findById;

    if (setup) {
      setup(model, sequelize);
    }

    return model;
  };
};

export {
  createModel
};
