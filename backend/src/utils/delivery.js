// Delivery charge calculator for KOMAL Restaurant, Bhatapara
const NEAR_PINCODES = ['493118']; // Bhatapara main pincode
const RESTAURANT_LAT = 21.7299;
const RESTAURANT_LNG = 81.9943;

// Haversine formula to calculate distance between two lat/lng coordinates in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const d = R * c; // Distance in km
  return d;
};

exports.calculateDeliveryCharge = (customerPincode, settings, lat, lng) => {
  const upTo1km = settings?.deliveryCharges?.upTo1km ?? 50;
  const above1km = settings?.deliveryCharges?.above1km ?? 80;

  // If coordinates are provided, use exact distance
  if (lat && lng) {
    const distanceKm = calculateDistance(RESTAURANT_LAT, RESTAURANT_LNG, parseFloat(lat), parseFloat(lng));
    if (distanceKm <= 1.5) { // Adding a small buffer (1.5km instead of 1.0km) for GPS inaccuracy
      return upTo1km;
    }
    // If distance is over 15km, we might want to reject, but for now just return above1km
    if (distanceKm > 15) {
      throw new Error('Sorry, your location is out of our delivery radius (15km limit).');
    }
    return above1km;
  }

  // Fallback to pincode if no coordinates
  if (NEAR_PINCODES.includes(customerPincode?.trim())) {
    return upTo1km;
  }
  return above1km;
};

exports.isDeliverable = (pincode, lat, lng) => {
  if (lat && lng) {
    const distanceKm = calculateDistance(RESTAURANT_LAT, RESTAURANT_LNG, parseFloat(lat), parseFloat(lng));
    return distanceKm <= 15;
  }
  if (!pincode) return false;
  const deliverablePincodes = ['493118', '493001', '493114', '493116', '493120', '493195', '493196'];
  return deliverablePincodes.includes(pincode.trim()) || pincode.trim().startsWith('493');
};
