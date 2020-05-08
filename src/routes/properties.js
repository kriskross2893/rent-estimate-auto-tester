import express from 'express';

import {rentEstimate} from '../lib';

const router = express.Router();

router.get('/', async (req, res) => {
  const response = await rentEstimate.findAllDistinctProperties();

  res.send({properties: response});
});

export default router;
