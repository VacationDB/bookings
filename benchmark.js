const siege = require('siege');

const stresser = siege().on(3004);

for (let i = 0; i < 30000; i += 1) {
  // for (let i = 9000000; i < 9090000; i += 1) {
  const listingId = 9000000 + Math.floor(Math.random() * 999999);
  batteryRam = stresser.for(1).times.get(`/api/listings/${listingId}`);
}

batteryRam.attack();
