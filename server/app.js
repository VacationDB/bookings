const express = require('express');

const app = express();
const parser = require('body-parser');
const Model = require('./database/index');

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
  // query Model for that index
  Model.findOne({ id: listingId }).exec((err, data) => {
    if (err) { throw err; }
    res.send(data);
  });
});

app.post('/api/submit', (req, res) => {
  const { checkIn, checkOut, id } = req.body;
  Model.findOne({ id }).exec((error, doc) => {
    const { availableDates } = doc;
    const newMonth = availableDates[checkIn.index].filter(date => (
      (date < checkIn.date || date > checkOut.date)
    ));
    availableDates[checkIn.index] = newMonth;
    doc.save((err) => {
      if (err) { throw err; }
      res.send(doc);
    });
  });
});

module.exports = app;
