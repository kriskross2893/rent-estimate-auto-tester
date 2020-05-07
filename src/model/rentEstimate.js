import { createModel } from "./base";

const name = 'RentEstimate';

const fields = (types) => ({
  improvedCompReportRankedID: {
    type: types.STRING,
    field: 'improved_comp_report_ranked_id',
    unique: true,
    primaryKey: true,
  },
  propertyID: {
    type: types.STRING,
    field: 'comp_prop_id',
    unique: true,
  },
  isManual: {
    type: types.INTEGER,
    field: 'comp_is_manual'
  },
  isPortfolio: {
    type: types.INTEGER,
    field: 'comp_is_portfolio'
  },
  isLeased: {
    type: types.INTEGER,
    field: 'comp_is_leased',
  },
  name: {
    type: types.STRING,
    field: 'comp_name',
  },
  targetRent: {
    type: types.FLOAT,
    field: 'comp_target_rent'
  },
  latitude: {
    type: types.FLOAT,
    field: 'comp_latitude'
  },
  longitude: {
    type: types.FLOAT,
    field: 'comp_longitude'
  },
  numBeds: {
    type: types.FLOAT,
    field: 'comp_bedroom_number'
  },
  numBaths: {
    type: types.FLOAT,
    field: 'comp_bathroom_number'
  },
  type: {
    type: types.STRING,
    field: 'comp_property_type',
    get() {
      const type = this.getDataValue('type');
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
    }
  },
  daysOld: {
    type: types.FLOAT,
    field: 'comp_days_old'
  },
  source: {
    type: types.STRING,
    field: 'comp_source'
  },
  dateCreated: {
    type: types.DATE,
    field: 'row_created'
  },
  externalKey: {
    type: types.STRING,
    field: 'comp_external_key',
    unique: true
  },
  rank: {
    type: types.INTEGER,
    field: 'comp_rank',
  },
  zipCode: {
    type: types.INTEGER,
    field: 'comp_zip_code',
  }
});

const options = {
  tableName: 'improved_comp_report_ranked',
};

export default createModel(
  name,
  fields,
  options,
);
