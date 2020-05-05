import db from '../model';

export async function findAllDistinctProperties() {
  const sequelize = db.sequelize;
  try {
    return await db.RentEstimate.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('comp_name')), 'name'],
        'longitude',
        'latitude',
        'numBeds',
        'numBaths',
        'type',
        'externalKey',
        'targetRent',
      ]
    });
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function findAllDistinctPropertiesWhere({
  numBeds,
  numBaths,
  propertyID
}) {
  const sequelize = db.sequelize;
  const {Op} = db.Sequelize;
  try {
    return await db.RentEstimate.findAll({
      where: {
        numBaths: {
          [Op.between]: [numBaths - 0.5, numBaths + 0.5]
        },
        numBeds,
        externalKey: {
          [Op.ne]: propertyID,
        },
      },
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('comp_name')), 'name'],
        'longitude',
        'latitude',
        'numBeds',
        'numBaths',
        'type',
        'externalKey',
        'targetRent',
        'isLeased',
      ]
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}
