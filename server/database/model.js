// require('dotenv').config()
const { Pool } = require('pg');

const config = {
  user: dianey,
  database: dianey,
  max_connections: 50,
};

const pool = new Pool();

pool.connect((err, client) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
});

const getData = (id, cb) => {
    const query = `SELECT * from reservations WHERE id=${id}`;
    client.query(query, (error, result) => {
      if (err) {
        return console.error('Error executing query', error.stack);
      }
      console.log(result.rows);
      cb(result.rows);
    });
  });

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


//module.exports.Listing = Listing;
module.exports.getData = getData;
module.exports.changeDates = changeDates;
