const express = require('express');

const app = express();
const parser = require('body-parser');
const Model = require('./database/model');

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
  Model.getData(listingId)
    .then(data => res.setMaxListeners(200).send(data))
    .catch(err => res.status(500).send(err));
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
  // const searchTerm = req.params.searchTerm;
  // db.returnSearch(id, searchTerm)
  //   .then(results => res.setMaxListeners(200).send(results))
  //   .catch(err => res.status(500).send(err));
});

// add CRUD API
app.put('/api/listings/:listingId', (req, res) => {
  Model.findByIdAndUpdate(req.params.listingId, req.body, { new: true }, (err, bookingsInfo) => {
    if (err) return res.status(405).send(err);
    return res.send(bookingsInfo);
  });
});
app.delete('/api/listings/:listingId', (req, res) => {
  Model.findByIdAndRemove(req.params.listingId, (err, booking) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: 'Reservation has been deleted',
      id: booking.id,
    };
    return res.status(200).send(response);
  });
});

module.exports = app;
