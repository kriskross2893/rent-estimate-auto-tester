import {promises as fs} from 'fs';
import computeForConfidenceInterval from '../utils/computeForConfidenceInterval';

delete require.cache[require.resolve('../../output/activeListings.json')];
delete require.cache[require.resolve('../../output/storedComparatables.json')];

const activeListings = require('../../output/activeListings.json');
const storedComparables = require('../../output/storedComparatables.json');

function getValidType(type) {
  switch (type) {
    case 'Apartment':
    case 'ApartmentBuilding':
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

export const getListingsComparables = () => ({
  async run() {
    const validListingsWithComparables = [];
    activeListings.listings.forEach((listing) => {

      // 3 miles
      const radius = 3;
      const centerX = listing.longitude;
      const centerY = listing.latitude;
      const listingBeds = listing.numBeds;
      const listingBaths = listing.numBaths;
      const listingType = getValidType(listing.type);
      const {propertyExternalKey} = listing;

      const directComparables = [];
      const nonDirectComparables = [];

      let idx = 0;
      while (idx < storedComparables.length) {
        const comparable = storedComparables[idx];
        const {
          longitude: x,
          latitude: y,
          numBeds,
          numBaths,
          type,
          externalKey,
        } = comparable;
        const comparableType = getValidType(type);

        const distance = getDistance(centerY, centerX, y, x);
        if (propertyExternalKey !== externalKey) {
          if (distance < radius) {
            if (comparableType === listingType) {
              if (
                listingBeds === numBeds
                && Math.abs(listingBaths - numBaths) < 1
              ) {
                directComparables.push({
                  ...comparable,
                  distance,
                });
              }
            } else {
              if (
                listingBeds === numBeds
                && Math.abs(listingBaths - numBaths) < 1
              ) {
                nonDirectComparables.push({
                  ...comparable,
                  distance,
                });
              }
            }
          }
        }
        idx++;
      }
      if (directComparables.length > 3) {
        const prices = directComparables.map(c => (
          c.targetRent
        ));
        const confidenceInterval = computeForConfidenceInterval(prices);

        validListingsWithComparables.push({
          ...listing,
          directComparables: directComparables.length,
          nonDirectComparables: nonDirectComparables.length,
          ...confidenceInterval,
        });
      }
    });

    await fs.writeFile(
      './output/listingComparables.json',
      JSON.stringify(validListingsWithComparables),
      'utf8'
    );

    return `Success listings with comparables ${validListingsWithComparables.length}/${activeListings.listings.length}`;
  }
});


export function getDistance(lat1, lon1, lat2, lon2) {
  const p = Math.PI / 180;
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 -lon1) * p))/2;

  return 11876.26761 * Math.asin(Math.sqrt(a));
}
