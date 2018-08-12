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

module.exports = Listing;
