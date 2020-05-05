import express from 'express';
import {rentEstimate} from '../lib';

const router = express.Router();

router.get("/", async function(req, res) {
  const distinctProperties = await rentEstimate.findAllDistinctProperties();
  res.send(distinctProperties);
});

module.exports = router;
