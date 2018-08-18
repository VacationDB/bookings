const express = require('express');
const redis = require('redis');

const app = express();
const parser = require('body-parser');
const db = require('./database/model');

const client = redis.createClient(6379, 'localhost');

client.on('connect', () => console.log('redis connected'));
client.on("error", function (err) {
  console.log("Error " + err);
});


app.use(express.static('./public'));


app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use('/listing/:listingId', express.static(`${__dirname}/../public`));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET');
  next();
});

// return a random calendar to client
app.get('/api/listings/:listingId', (req, res) => {
  const { listingId } = req.params;
  // query db for that index
  client.get(listingId, (err, reply) => {
    if (err) console.error(`Redis get ${err}`);
    if (reply) {
      // console.log("Retrieved Redis Cache")
      const body = JSON.parse(reply);
      res.send(body);
    } else {
      db.getData(listingId, (data) => {
      // console.log("data: ", data);
        client.setex(listingId, 3000, JSON.stringify(data));
        // console.log("Set Redis Cache");
        res.setMaxListeners(200).send(data);
      });
    }
  });
});

app.post('/api/submit', (req, res) => {
  const { id, checkin, duration } = req.params;
  db.addDates(id, checkin, duration, (error, data) => {
    if (error) {
      res.setMaxListeners(500).send(error);
    }
    res.setMaxListeners(200).send(data);
  });
});

// const { checkIn, checkOut, id } = req.body;
// db.findOne({ id }).exec((error, doc) => {
//   const { availableDates } = doc;
//   const newMonth = availableDates[checkIn.index].filter(date => (
//     (date < checkIn.date || date > checkOut.date)
//   ));
//   availableDates[checkIn.index] = newMonth;
//   doc.save((err) => {
//     if (err) { throw err; }
//     res.send(doc);
//   });
// });
// const searchTerm = req.params.searchTerm;
// add CRUD API

app.put('/api/listings/:listingId', (req, res) => {
  const { listingId } = req.params;
  const { reservationNum, checkin, duration } = req.body;
  // query db for that index
  db.changeDates(reservationNum, listingId, checkin, duration, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    res.setMaxListeners(200).send(data);
  });
});

app.delete('/api/listings/:listingId', (req, res) => {
  const { reservationNum } = req.body;
  // query db for that index
  db.deleteReservation(reservationNum, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    res.setMaxListeners(200).send(data);
  });
});

module.exports = app;
