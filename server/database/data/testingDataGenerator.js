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

// generate a year of availability info based on the current date
const generateBookings = function () {
  let bookings = [];
  
  const startDate = new Date();
  let currentMonth = startDate.getMonth();
  let year = startDate.getFullYear();

  for (let i = 0; i < 12; i++) {
    const last = new Date(year, currentMonth + 1, 0).getDate();
    const month = [];
    const dateCount = 15 - random(10);
    const store = {};
    for (let j = 0; j < dateCount; j++) {
      const day = random(last);
      if (!store[day]) {
        month.push(day);
        store[day] = true;
      }
    }
    month.sort((a, b) => b - a);
    bookings.push(month);
    if (currentMonth === 11) {
      currentMonth = 0;
      year++;
    } else {
      currentMonth++;
    }
    currentDate = new Date(year, currentMonth, 1);
  }
  bookings = JSON.stringify(bookings);
  return bookings;
};


const generator = function () {
  let nightlyPrice = price();
  let data = `0,house0,${nightlyPrice},${cleaning()},${serviceFee(nightlyPrice)},${3 + random(6)},${random(10)},"${generateBookings()}"`;
  for (let i = 1; i < 10000000; i++) {
    let nightlyPrice = price();
    data += `\n${i},house${i},${nightlyPrice},${cleaning()},${serviceFee(nightlyPrice)},${3 + random(6)},${random(10)},"${generateBookings()}"`;
  }
  console.log(data);
};

console.log(`id, housename, price, cleaningFee, serviceFee, minStay, maxGuests, availableDates`);
generator();

//in command line: run "node server/database/data/testingDataGenerator.js | gzip -c > server/database/data/testingData.csv.gz"
//if not enough HEAP memory: edit to create CSV of 100K at a time, then cat csv files together
