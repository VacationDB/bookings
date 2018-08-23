require('dotenv').config();
const { Pool } = require('pg');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  port: 5432,
  password: process.env.DB_PASSWORD,
  max_connections: 50,
};

const pool = new Pool(config);

pool.connect((err, poolClient) => {
  if (err) {
 
    return console.error('Error acquiring client', err.stack);
  }
  console.log('client has connected');
  client = poolClient;
});

// READ / GET
const getData = (id, cb) => {
  const query = `select * from housedata join reservations on housedata.id=reservations.id where housedata.id=${id}
  order by duration desc;`;
  client.query(query, (err, result) => {
    if (err) {
      return console.error('Error executing query', error.stack);
    }
    cb(result.rows);
  });
};

// POST
const addDates = (id, checkin, duration, cb) => {
  const query = `INSERT INTO reservations(id, checkin, duration) VALUES(${id},${checkin},${duration})`;
  client.query(query, (err, result) => {
    if (err) {
      return console.error('Error executing query', error.stack);
    }
    console.log(result.rows);
    cb(result.rows);
  });
};

// PUT
const changeDates = (reservationNum, id, checkin, duration, cb) => {
  const query = `UPDATE reservations SET id=${id}, checkin=${checkin}, duration=${duration} WHERE reservationNum=${reservationNum}`;
  client.query(query, (err, result) => {
    if (err) {
      return console.error('Error executing query', error.stack);
    }
    console.log('Reservation successfully updated');
    cb('Reservation successfully updated');
  });
};

// DELETE
const deleteReservation = (reservationNum, cb) => {
  const query = `DELETE FROM reservations WHERE reservationNum=${reservationNum}`;
  client.query(query, (err) => {
    if (err) {
      return console.error('Error executing query', error.stack);
    }
    console.log('Reservation has been deleted');
    cb('Reservation has been deleted');
  });
};

module.exports.getData = getData;
module.exports.addDates = addDates;
module.exports.changeDates = changeDates;
module.exports.deleteReservation = deleteReservation;
