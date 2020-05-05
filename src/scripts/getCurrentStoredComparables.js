import {promises as fs} from 'fs';
import debugLib from 'debug';

import {rentEstimate} from '../lib';

const debug = debugLib('rent-estimate:get-current-active-listings');

export const getCurrentStoredComparables = () => ({
  async run() {
    const json = await rentEstimate.findAllDistinctProperties();
    await fs.writeFile('./output/storedComparatables.json', JSON.stringify(json), 'utf8');
  }
});
