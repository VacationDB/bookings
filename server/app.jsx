/* import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../client/components/App';
import Html from '../client/Html'; */

const express = require('express');
const React = require('react');
const { renderToString } = require('react-dom/server');
const App = require('../client/components/App');
const Html = require('../client/Html');

const parser = require('body-parser');
const app = express();
const Model = require('./database/index');

// app.use(express.static('./public'));


app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET');
  next();
});

// app.use('/listing/:listingId', express.static(`${__dirname}/../public`));
app.get('/listings/:listingId', (req, res) => {
  const title = 'Server rendered component';
  const { listingId } = req.params;

  /* const body = renderToString(<App />);
  res.send(Html({
    body,
    title,
  })); */
  // query Model for that index
  Model.findOne({ id: listingId }).exec((err, data) => {
    if (err) { throw err; }
    const body = renderToString(<App {...data} />);
    res.send(Html({
      body,
      title,
    }));
  });
});
// return a random calendar to client
/* app.get('/api/listings/:listingId', (req, res) => {
  const { listingId } = req.params;
  // query Model for that index
  Model.findOne({ id: listingId }).exec((err, data) => {
    if (err) { throw err; }
    res.send(data);
  });
}); */

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
