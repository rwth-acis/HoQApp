/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/build/views');

const mongoose = require('mongoose');
const specificationSchema = require('./specification-schema.js');
const productSchema = require('./product-schema.js');
const Specification = mongoose.model('specification', specificationSchema);
const Product = mongoose.model('product', productSchema);
mongoose.connect('mongodb+srv://bigBoss:test123@cluster0-4p8pc.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log('connected');
});
// This serves static files from the specified directory
app.use(express.static(__dirname + '/build'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// landing page
app.get('/', function(req, res){
  res.render('projects');
});

// landing page
app.get(['/home', '/home.jade'], (req, res) => {
  res.render('home');
});

// projects
app.get(['/projects', '/projects.jade'], (req, res) => {
  res.render('projects');
});

// categories
app.get(['/categories', '/categories.jade'], (req, res) => {
  if(req.query.projectId){
    res.render('categories', {projectId: req.query.projectId});
  } else {
    res.send("error");
  }
  // TODO: fix error message
});

// categories
app.get(['/hoq', '/hoq.jade'], (req, res) => {
  if(req.query.categoryId){
    Product.find({categoryId: req.query.categoryId}, function(err, products){
      if (err) return console.error(err);
      if(products.length == 0){
        for(var i = 0; i < 5; i++){
          var product = new Product({
            id: i,
            name: "",
            categoryId: req.query.categoryId,
            abbreviation: "",
            requirements: [],
            created: Date.now()
          });
          requirements = getRequest('https://requirements-bazaar.org/bazaar/categories/' + req.query.categoryId + '/requirements?per_page=100&state=all');
          for(j = 0; j < requirements.length; j++){
            product.requirements.push({_id: requirements[j].id, value: 0});
          }
          product.save(function(err2){
            if (err2) return console.error(err2);
          });
        }
      }
      res.render('HoQ', {categoryId: req.query.categoryId});
    });
  } else {
    res.send("error");
  }
  // TODO: fix error message
});

// read ts
app.get('/api/tech-specifications', (req, res) => {
  if(req.query.categoryId){
    Specification.find({categoryId: req.query.categoryId}, function(err, specifications){
      res.json(specifications);
    });
  }
});

// create ts
app.post('/api/tech-specifications', (req, res) => {
  var newSpecification = req.body;
  console.log("SAVE SINGLE");
  var newSpec = new Specification({
    name: newSpecification.name,
    categoryId: newSpecification.categoryId,
    minMax: newSpecification.minMax,
    target: newSpecification.target,
    requirements: newSpecification.requirements,
    specifications: newSpecification.specifications,
    created: Date.now()
  });
  newSpec.save(function (err) {
    if (err) return console.error(err);
    Specification.find({categoryId: newSpecification.categoryId}, function(err, specifications){
      if(err) return console.error(err);
      console.log("SAVE MANY (UPDATE)");
      for(var i = 0; i < specifications.length; i++){
        specifications[i].specifications.push({"_id": newSpec._id, "value": 0});
        specifications[i].save(function (err2) {
          if (err2) return console.error(err2);
        });
      }
    });
    res.json(newSpec._id);
  });
});

// update ts
app.put('/api/tech-specifications', (req, res) => {
  var updateSpecification = req.body;
  console.log("UPDATE SINGLE");
  Specification.findById(updateSpecification._id, function(err, updateSpec){
    if(err) return console.error(err);
    if(updateSpec){
      updateSpec.name = updateSpecification.name;
      updateSpec.minMax = updateSpecification.minMax;
      updateSpec.target = updateSpecification.target;
      updateSpec.requirements = updateSpecification.requirements;
      updateSpec.specifications = updateSpecification.specifications;
      updateSpec.save(function (err2){
        if(err2) return console.error(err2);
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(500);
      return;
    }
  });
});

// delete
app.delete('/api/tech-specifications', (req, res) => {
  var deleteSpecification = req.body;
  console.log("DELETE ONCE");
  Specification.deleteOne({ _id: deleteSpecification._id }, function(err){
    if(err) return console.error(err);
    console.log("DELETE CHILDREN (UPDATE)");
    Specification.find({}, function(err, specifications){
      if(err) return console.error(err);
      for(var i = 0; i < specifications.length; i++){
        console.log(specifications.length);
        var index = -1;
        for(var j = 0; j < specifications[i].specifications.length; j++){
          if(specifications[i].specifications[j]._id == deleteSpecification._id){
            index = j;
          }
        }
        if(index > -1){
          console.log("Deleting " + specifications[i].specifications[index]);
          specifications[i].specifications.splice(index, 1);
        }
        specifications[i].save(function (err2) {
          if (err2) return console.error(err2);
        });
      }
      res.sendStatus(200);
    });
  });
});

// read products
app.get('/api/products', (req, res) => {
  if(req.query.categoryId){
    Product.find({categoryId: req.query.categoryId}, function(err, products){
      res.json(products);
    });
  }
});

// update product
app.put('/api/products', (req, res) => {
  var updateProduct = req.body;
  console.log("UPDATE SINGLE");
  Product.findOne({categoryId: updateProduct.categoryId, id: updateProduct.id}, function(err, product){
    if(err) return console.error(err);
    if(product){
      product.name = updateProduct.name;
      if(updateProduct.name.length < 2){
        product.abbreviation = updateProduct.name;
      } else {
        product.abbreviation = updateProduct.name.toUpperCase().substring(0, 1) + updateProduct.name.toLowerCase().substring(1, 2);
      }
      product.requirements = updateProduct.requirements;
      product.specifications = updateProduct.specifications;
      product.save(function (err2){
        if(err2) return console.error(err2);
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(500);
      return;
    }
  });
});

app.get('/api/getAll', (req, res) => {
  let options = {
    root: __dirname + '/server-data/'
  };

  const fileName = 'events.json';
  res.sendFile(fileName, options, (err) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
  });
});

app.post('/api/add', (req, res) => {
  let jsonFile = __dirname + '/server-data/events.json';
  let newEvent = req.body;
  ('Adding new event:', newEvent);
  fs.readFile(jsonFile, (err, data) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let events = JSON.parse(data);
    events.push(newEvent);
    let eventsJson = JSON.stringify(events, null, 2);
    fs.writeFile(jsonFile, eventsJson, err => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      // You could also respond with the database json to save a round trip
      res.sendStatus(200);
    });
  });
});

//
app.post('/api/delete', (req, res) => {
  let jsonFile = __dirname + '/server-data/events.json';
  let id = req.body.id;
  fs.readFile(jsonFile, (err, data) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let events = JSON.parse(data);
    let index = events.findIndex(event => event.id == id);
    events.splice(index, 1);

    let eventsJson = JSON.stringify(events, null, 2);

    fs.writeFile(jsonFile, eventsJson, err => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

function getRequest(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false ); // false for synchronous request
  xmlHttp.send( null );
  // if(xmlHttp.status == 404){
  //   return null;
  // }
  return JSON.parse(xmlHttp.responseText);
}

const server = app.listen(8081, () => {

  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
