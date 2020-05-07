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
  propertyID,
  zipCode
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
        zipCode,
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
        'zipCode',
      ]
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}
