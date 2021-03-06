require('newrelic');
const express = require('express');
const redis = require('redis');
const cluster = require('cluster');

const app = express();

if (cluster.isMaster) {
  const numWorkers = require('os').cpus().length;
  console.log('Master cluster setting up ' + numWorkers + ' workers...');
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }
  cluster.on('online', (worker) => {
    console.log('Worker ' + worker.process.pid + ' is online');
  });
  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {

  const parser = require('body-parser');
  const db = require('./database/model');

  const redisClient = redis.createClient(6379, 'localhost');
  redisClient.on('connect', () => console.log('redis connected'));
  redisClient.on("error", (err) => {
    console.log("Error " + err);
  });

  app.listen(process.env.PORT || 3004);
  // app.set("port", process.env.PORT || 3004);
  //   app.listen(app.get('port'), () =>
  //   console.log(`listening on port ${app.get("port")}!`)
  // );


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
    redisClient.get(listingId, (err, reply) => {
      if (err) console.error(`Redis get ${err}`);
      if (reply) {
        // console.log("Retrieved Redis Cache")
        const body = JSON.parse(reply);
        res.send(body);
      } else {
        db.getData(listingId, (data) => {
          // console.log("data: ", data);
          redisClient.setex(listingId, 3000, JSON.stringify(data));
          // console.log("Set Redis Cache");
          res.send(data);
        });
      }
    });
  });
  
  app.post('/api/submit', (req, res) => {
    const { id, checkin, duration } = req.params;
    db.addDates(id, checkin, duration, (error, data) => {
      if (error) {
        res.send(error);
      }
      res.send(data);
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
      res.send(data);
    });
  });
  
  app.delete('/api/listings/:listingId', (req, res) => {
    const { reservationNum } = req.body;
    // query db for that index
    db.deleteReservation(reservationNum, (error, data) => {
      if (error) {
        res.status(500).send(error);
      }
      res.send(data);
    });
  });
}
module.exports = app;
