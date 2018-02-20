var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./properties_server.txt');

const PORT = properties.get('port');

const URL = properties.get('url');
const USER_MONGO = properties.get('userMongo');
const PASSWORD_MONGO = properties.get('passwordMongo');
const SERVER_MONGO = properties.get('serverMongo');
const PORT_MONGO = properties.get('portMongo');
const DB_MONGO = properties.get('dbMongo');
const DB_IP_NETWORK = properties.get('addressIP');


var database;
var myCollectionHouses;

var cors = require('cors'); 
var express = require('express');
var http = require('http');
var mongo =  require('mongodb');
var bodyParser = require('body-parser');

var app = express();
app.use(cors());
app.use(bodyParser.json());

var mb = require('morgan-body');

mb(app);

app.use(function (err, req, res, next) {
console.log("--------------------\n");

console.log(err);

console.log("\n\n--------------------\nERROR REQUEST: ");
console.log("URL: " + req.url);
console.log("REQUEST BODY: \n" + err.body );
console.log("--------------------\n\n\n")
next();
})

var MongoClient = mongo.MongoClient;

var url_for_connect = URL + USER_MONGO + ":" + PASSWORD_MONGO + "@" + SERVER_MONGO + ":" + PORT_MONGO
 + "/" + DB_MONGO;
 

// connect with authentication or not
function try_to_connect (err, db) {
    if (err) { 
        console.log(err.name + " - " + err.message);
        console.log("Error connecting to MongoDB. Aborting...");
        process.exit()
    }
    else {
        database = db;

        housesCollection = database.collection('Houses');
        userCollection = database.collection('Users');


        console.log("Connected to Mongo with successed !");
    }
}


MongoClient.connect(url_for_connect, function(err, db) {
    try_to_connect (err, db);
});


var server = app.listen(PORT, DB_IP_NETWORK, function() {
	console.log("Started on " +  server.address().address + " address and port " + server.address().port);
});


 

 

module.exports = {
    mongo : function () {
        return mongo;
    },
    application : function () {
        return app;
    },
    connectHousesDB : function () {
        return housesCollection;
    },
    connectUsersDB : function () {
        return userCollection;
    }
}
