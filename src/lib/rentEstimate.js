import db from '../model';

export async function findAllDistinctProperties() {
  const Op = db.Sequelize.Op;
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
