const mongoose = require('mongoose')

const specificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  categoryId: {
    type: Number,
    required: [true, 'CategoryId is required']
  },
  requirements: [{ _id: String, value: Number }],
  minMax: Number,
  target: String,
  specifications: [{ _id: String, value: Number }],
  created: {
    type: Date,
    required: [true, 'Created date is required']
  }
});

module.exports = specificationSchema
