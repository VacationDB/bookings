// require('dotenv').config()
const { Pool } = require('pg');

const config = {
  user: dianey,
  database: dianey,
  max_connections: 250
};

const pool = new Pool();

const getData = (id, cb) => {
  pool.connect((err, client) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    const query = 'SELECT * from reservations WHERE id < 10';
    client.query(query, (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log(result.rows)
    });
  });
};

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


module.exports.Listing = Listing;
module.exports.getData = getData;
module.exports.changeDates = changeDates;
