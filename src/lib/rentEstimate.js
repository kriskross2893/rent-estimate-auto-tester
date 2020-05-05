import db from '../model';

async function findAllDistinctProperties() {
  const Op = db.Sequelize.Op;
  const sequelize = db.sequelize;

  return await db.RentEstimate.findAll({
    attributes: [
      'improvedCompReportRankedID',
      [sequelize.fn('DISTINCT', 'name'), 'name'],
      'longitude',
      'latitude',
      'numBeds',
      'numBaths',
      'type',
    ]
  });
}
