import express from 'express';

import {rentEstimate} from '../lib';
import {getDistance} from '../scripts/getListingsComparables';

const router = express.Router();

const radiusLimit = 3;

router.post("/", async function(req, res) {
  const {
    numBeds,
    numBaths,
    latitude: lat1,
    longitude: lng1,
    propertyID,
  } = req.body;

  const distinctProperties = await rentEstimate
    .findAllDistinctPropertiesWhere({
      numBaths,
      numBeds,
      propertyID
    });
  const comparables = [];
  distinctProperties.forEach(function(comparable){
    const {
      longitude: lng2,
      latitude: lat2,
      externalKey: comp_external_key,
      name: comp_name,
      numBeds: comp_bedroom_number,
      numBaths: comp_bathroom_number,
      type: comp_property_type,
      targetRent: comp_target_rent,
      isLeased: comp_is_leased,
    } = comparable;

    const distance = getDistance(lat1, lng1, lat2, lng2);
    if (distance < radiusLimit) {
      comparables.push({
        comp_external_key,
        comp_name,
        comp_bedroom_number,
        comp_bathroom_number,
        comp_property_type,
        comp_target_rent,
        comp_is_leased,
        comp_rank: null,
        comp_mi_distance: distance,
        trends: [],
      });
    }
  });

  const property = {
    property_bedroom_number: numBeds,
    property_bathroom_number: numBaths,
    propertyExternalKey: propertyID,
    property_latitude: lat1,
    property_longitude: lng1,
    property_name: null,
    property_target_rent: null,
    property_type: null,
    comps: comparables,
    competitor_count: 0,
    similar_leased: 0,
    inquiry_count_total: 0
  };

  res.send({property});
});

module.exports = router;
