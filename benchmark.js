const siege = require('siege');

const stresser = siege().on(3004);

for (let listingId = 9000000; listingId < 9999999; listingId += 3) {
  batteryRam = stresser.for(1).times.get(`/api/listings/${listingId}`);
}

batteryRam.attack();
