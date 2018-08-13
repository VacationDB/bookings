const Model = require('./model');

Model.Listing.remove({}, (err) => {
  if (err) {
    throw err;
  }
});

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
  const bookings = [];
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
  return JSON.stringify(bookings);
};

const generator = function () {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const nightlyPrice = price();
    data.push({
      id: i,
      price: nightlyPrice,
      cleaningFee: cleaning(),
      serviceFee: serviceFee(nightlyPrice),
      minStay: 3 + random(6),
      maxGuests: random(10),
      availableDates: generateBookings(),
    });
  }
  Model.Listing.insertMany(data, (err) => {
    if (err) throw err;
    process.exit();
  });
};

generator();
