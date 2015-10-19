'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  close: [Number],
  date: [String],
  symbol: String
});

module.exports = mongoose.model('Thing', ThingSchema);