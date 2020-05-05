import {promises as fs} from 'fs';
import algoliaSearch from 'algoliasearch';
import debugLib from 'debug';

const debug = debugLib('rent-estimate:get-current-active-listings');

const {
  ALGOLIA_APP_ID,
  ALGOLIA_CLIENT_API_KEY,
  ALGOLIA_INDEX
} = process.env;

const DEFAULT_FILTERS = 'targetRent >= 1000 AND (status: \'Active\' OR status: \'Coming Soon\') AND isDeleted: false';
const DEFAULT_OPTS = {
  page: 0,
  sort: 'price_asc',
};

const client = algoliaSearch(
  ALGOLIA_APP_ID,
  ALGOLIA_CLIENT_API_KEY,
);

const priceIndex = client.initIndex(`${ALGOLIA_INDEX}_price-asc`);

const algolia = {
  default: priceIndex
};

function mapListings(listings) {
  return listings.map(listing => ({
    propertyExternalKey: listing.propertyID,
    numBaths: listing.numBaths,
    numBeds: listing.numBeds,
    targetRent: listing.targetRent,
    type: listing.type,
    longitude: listing.longitude,
    latitude: listing.latitude,
    city: listing.city,
    state: listing.state,
    street: listing.street,
    unitNumber: listing.unitNumber,
  }));
}

export const getCurrentActiveListings = () => ({
  async run() {
    const algoliaFilters = DEFAULT_FILTERS;
    const algoliaOpts = DEFAULT_OPTS;
    const {sort, ...extraOpts} = algoliaOpts;
    const opts = {
      filters: algoliaFilters,
      ...extraOpts,
      hitsPerPage: 1900,
    };
    const index = 'default';
    const response = await algolia[index].search('', opts);
    if (response && response.hits && response.hits.length) {
      debug('successfully fetched from algolia. mapping to necessary fields');
      const json = {
        listings: mapListings(response.hits)
      };
      await fs.writeFile('./output/activeListings.json', JSON.stringify(json), 'utf8');
      return 'Success';
    }
    throw Error('Write failed. could not generate');
  }
});
