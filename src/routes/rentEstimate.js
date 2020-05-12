import express from 'express';

import {
  rentEstimate
} from '../lib';
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
    propertyType,
    zipCode,
  } = req.body;

  const propertyGroup = rentEstimate.getPropertyType(propertyType);

  const distinctProperties = await rentEstimate
    .findAllDistinctPropertiesWhere({
      numBaths,
      numBeds,
      propertyID,
      zipCode,
    });

  let comps = [];
  const exactMatch = [];
  const goodMatch = [];
  const otherProperty = [];
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
      zipCode,
    } = comparable;

    const distance = getDistance(lat1, lng1, lat2, lng2);
    if (distance < radiusLimit) {
      const comp = {
        comp_external_key,
        comp_name,
        comp_bedroom_number,
        comp_bathroom_number,
        comp_property_type,
        comp_target_rent,
        comp_is_leased,
        comp_mi_distance: distance,
        comp_zip_code: zipCode,
        trends: [],
      };
      if (
        comp_bathroom_number === numBaths
        && propertyGroup === comp_property_type
      ) {
        exactMatch.push({
          ...comp,
          comp_rank: 1,
        });
      } else if (
        comp_bathroom_number !== numBaths
        && propertyGroup === comp_property_type
      ) {
        goodMatch.push({
          ...comp,
          comp_rank: 2,
        });
      } else {
        otherProperty.push({
          ...comp,
          comp_rank: 3,
        });
      }
    }
  });

  if (exactMatch.length > 0) {
    exactMatch.sort(rentEstimate.sortComparables);
    comps = comps.concat(exactMatch);
  }

  if (goodMatch.length > 0) {
    goodMatch.sort(rentEstimate.sortComparables);
    comps = comps.concat(goodMatch);
  }

  if (otherProperty.length > 0) {
    otherProperty.sort(rentEstimate.sortComparables);
    comps = comps.concat(otherProperty);
  }

  const property = {
    property_bedroom_number: numBeds,
    property_bathroom_number: numBaths,
    propertyExternalKey: propertyID,
    property_latitude: lat1,
    property_longitude: lng1,
    property_name: null,
    property_target_rent: null,
    property_type: null,
    comps,
    // set placeholders
    competitor_count: 0,
    similar_leased: 0,
    inquiry_count_total: 0
  };

  res.send({property});
});

module.exports = router;
