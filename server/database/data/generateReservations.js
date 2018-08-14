const faker = require('faker');

const generateBookingDates = () => {
  const totalBookings = [];
  for (let i = 0; i < 100; i += 1) {
    const maxDateId = 365;
    // a guest can stay 14 days max
    const maxStayLength = 14;
    // holds all the bookings for this room
    const bookingsPerRoom = [];
    // generate the number of bookings for this room (min: 15, max: 45)
    const numBookings = 15 + Math.floor(31 * Math.random());
    // create the bookings
    for (let j = 0; j < numBookings; j += 1) {
      const currentStayLength = Math.floor(maxStayLength * Math.random());
      const currentStayStart = Math.floor(maxDateId * Math.random());
      const currentStayEnd = currentStayStart + currentStayLength;
      if (currentStayEnd <= maxDateId) {
        if (bookingsPerRoom.length === 0) {
          bookingsPerRoom.push([currentStayStart, currentStayEnd]);
        } else {
          const stop = bookingsPerRoom.length;
          for (let k = 0; k < stop; k += 1) {
            // check if the room is already occupied during this time
            if ((currentStayStart >= bookingsPerRoom[k][0]
              && currentStayStart < bookingsPerRoom[k][1])
              || (currentStayEnd > bookingsPerRoom[k][0]
              && currentStayEnd <= bookingsPerRoom[k][1])
              || (currentStayStart <= bookingsPerRoom[k][0]
              && currentStayEnd >= bookingsPerRoom[k][1])) {
              break;
            } else if (k === stop - 1) {
              // add this bookings to the current room's bookings
              bookingsPerRoom.push([currentStayStart, currentStayEnd]);
            }
          }
        }
      }
    }
    const bookingsPerRoomWithDates = bookingsPerRoom.map(booking => booking.map(date => moment([2018, 0, 1]).add(date, 'days').format('YYYY-MM-DD')));
    // add bookings for this room into the total bookings array
    totalBookings.push(bookingsPerRoomWithDates);
  }
  return totalBookings;
};

const generateBookedDatesCSV = (bookingsArray) => {
  let counter = 0;
  const csvLine = bookingsArray.map((room, roomIndex) => {
    const dateSetForRoom = room.map((dateArr) => {
      counter += 1;
      return `${counter}, ${dateArr[0]}, ${dateArr[1]}, ${roomIndex + 1}`;
    });
    return dateSetForRoom;
  });
  return csvLine.map(room => room.join('\r\n')).join('\r\n');
};

const dataGenerator = function () {
  
  for (let i = 1; i < 10000000; i++) {
    const nightlyPrice = price();
    data += `\n${i},house${i},${nightlyPrice},${cleaning()},${serviceFee(nightlyPrice)},${3 + random(6)},${random(10)}`;
  }
  console.log(data);
};

console.log('id, checkin, checkout');
dataGenerator();

// in command line: run "time node --max-old-space-size=12192 server/database/data/generateReservationsData.js | gzip -c > server/database/data/reservationsData.csv.gz"
// result:
//
