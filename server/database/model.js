const mongoose = require('mongoose');

mongoose.connect('mongodb://database:27017/listings', { useNewUrlParser: true });
const { Schema } = mongoose;

const listingSchema = new Schema({
  id: Number,
  price: Number,
  cleaningFee: Number,
  serviceFee: Number,
  minStay: Number,
  maxGuests: Number,
  availableDates: String,
});

const Listing = mongoose.model('Listing', listingSchema);

const getData = id => (
  Listing.findOne({ id })
);

const changeDates = (checkIn, checkOut, id) => {
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
}

// 

module.exports.Listing = Listing;
module.exports.getData = getData;
module.exports.changeDates = changeDates;


// const { Pool } = require('pg')

// const pool = new Pool()

// pool.connect((err, client, release) => {
//   if (err) {
//     return console.error('Error acquiring client', err.stack)
//   }
//   client.query('SELECT NOW()', (err, result) => {
//     release()
//     if (err) {
//       return console.error('Error executing query', err.stack)
//     }
//     console.log(result.rows)
//   })
// })