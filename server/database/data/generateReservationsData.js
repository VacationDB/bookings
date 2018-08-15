let data = '';

const random = function (num) {
  return Math.ceil(Math.random() * num);
};

// Generate a random date in year 2018
const generateRandomDate = () => {
  const start = new Date(2018, 0, 1);
  const end = new Date(2018, 11, 31);
  return new Date(+start + Math.random() * (end - start));
};

// generate a random number of bookings per house
const generateBookings = (houseId) => {
  const numberOfBookings = 1 + random(12);
  let j = 0;
  while (j < numberOfBookings) {
    data += `\n${houseId},${generateRandomDate().toJSON()},${3 + random(21)}`;
    j++;
  }
};

// // ****************************UNCOMENT to generate 1/4 CSV *********************
// const dataGenerator = function () {
//   // Add first line to data to avoid empty new line
//   data += `0,${generateRandomDate().toJSON()},${3 + random(21)}`;
//   // for each house ID generate a random numnber of bookings
//   for (let i = 0; i < 2500000; i++) {
//     generateBookings(i);
//   }
//   console.log(data);
// };

// console.log('id, checkin, duration');
// dataGenerator();

// // in command line: run 
// // "time node --max-old-space-size=12192 server/database/data/generateReservationsData.js | gzip -c > server/database/data/reservationsData1.csv.gz"
// // result:   
// // 56.60s user 3.64s system 59% cpu 1:41.62 total
// // turning into zip  43.61s user 0.24s system 43% cpu 1:41.62 total
// //******************************* END UNCOMMENT FOR 1/4 CSV **************************

const dataGenerator = function () {
  // Add first line to data to avoid empty new line
  data += `7500000,${generateRandomDate().toJSON()},${3 + random(21)}`;
  // for each house ID generate a random numnber of bookings
  for (let i = 7500000; i < 10000000; i++) {
    generateBookings(i);
  }
  console.log(data);
};
dataGenerator();

// Shell Command:
// node --max-old-space-size=12192 server/database/data/generateReservationsData.js | gzip -c > server/database/data/reservationsData<<2 to 4>>.csv.gz"

// After generating all 4 csv files, combine together:
// cat reservationsData1.csv reservationsData2.csv reservationsData3.csv reservationsData4.csv > reservationsData.csv
