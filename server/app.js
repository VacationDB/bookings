const express = require('express');

const app = express();
const parser = require('body-parser');
const db = require('./database/model');

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
  db.getData(listingId, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    res.setMaxListeners(200).send(data);
  });
});

addDates
app.post('/api/submit', (req, res) => {
  db.addDates(
    
  );
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
// db.returnSearch(id, searchTerm)
//   .then(results => res.setMaxListeners(200).send(results))
//   .catch(err => res.status(500).send(err));
// add CRUD API

app.put('/api/listings/:listingId', (req, res) => {
  const { listingId } = req.params;
  // query db for that index
  db.changeDates(listingId, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    res.setMaxListeners(200).send(data);
  });
});

app.delete('/api/listings/:listingId', (req, res) => {
  const { listingId } = req.params;
  // query db for that index
  db.deleteReservation(listingId, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    res.setMaxListeners(200).send(data);
  });
});

module.exports = app;
