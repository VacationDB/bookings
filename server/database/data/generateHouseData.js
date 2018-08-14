const random = function (num) {
  return Math.ceil(Math.random() * num);
};

const price = function () {
  return 500 - random(400);
};

const cleaning = function () {
  const options = [50, 75, 100, 125, 150];
  return options[random(4)];
};

const serviceFee = function (initialPrice) {
  const percent = random(20) / 100;
  return Math.ceil(initialPrice * percent);
};

const generator = function () {
  const nightlyPrice = price();
  let data = `0,house0,${nightlyPrice},${cleaning()},${serviceFee(nightlyPrice)},${3 + random(6)},${random(10)}`;
  for (let i = 1; i < 10000000; i++) {
    const nightlyPrice = price();
    data += `\n${i},house${i},${nightlyPrice},${cleaning()},${serviceFee(nightlyPrice)},${3 + random(6)},${random(10)}`;
  }
  console.log(data);
};

console.log(`id, housename, price, cleaningFee, serviceFee, minStay, maxGuests`);
generator();

//in command line: run "time node --max-old-space-size=12192 server/database/data/generateHouseData.js | gzip -c > server/database/data/houseData.csv.gz"
// result: 
// node --max-old-space-size=12192 server/database/data/generateHouseData.js  24.67s user 6.13s system 58% cpu 52.482 total
// gzip -c > server/database/data/houseData.csv.gz  22.69s user 0.08s system 43% cpu 52.482 total
// added flag to process to increase heapsize to create csv in one line


