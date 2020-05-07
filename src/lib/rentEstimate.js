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
        'zipCode'
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
          [Op.between]: [numBaths - 1, numBaths + 1]
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

export const getPropertyType = (type) => {
  switch (type) {
    case 'Apartment':
    case 'Apartment Building':
    case 'ApartmentBuilding':
    case 'Walkup Apartment':
      return 'Apartment';
    case 'Single Family Home':
    case 'Single Family':
    case 'Two Story Home':
    case '2 Story Home':
    case 'Two-Storey Home':
      return 'Single Family Home';
    case 'Condo':
    case 'Condominium':
      return 'Condo';
    case 'Townhouse':
    case 'Townhouse/Loft':
    case 'Townhouse/In-Law':
      return 'Townhouse';
    case 'Multi-Family Home':
    case 'Fourplex':
      return 'Multi-Family Home';
    default:
      return type;
  }
};

export const sortComparables = (a, b) => {
  return a.comp_mi_distance - b.comp_mi_distance;
};
