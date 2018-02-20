//var PropertiesReader = require('properties-reader');
//var properties = PropertiesReader('./properties_server.txt');



//const URL = properties.get('url');
//const USER_MONGO = properties.get('userMongo');
//const PASSWORD_MONGO = properties.get('passwordMongo');
//const SERVER_MONGO = properties.get('serverMongo');
//const PORT_MONGO = properties.get('portMongo');
//const DB_MONGO = properties.get('dbMongo');
var cors = require('cors'); 
var express = require('express');
var http = require('http');
var mongo =  require('mongodb');
var bodyParser = require('body-parser');
var mb = require('morgan-body');


const DB_IP_NETWORK = process.env.OPENSHIFT_NODEJS_IP   //properties.get('addressIP'); - 127.0.0.1
const PORT = process.env.OPENSHIFT_NODEJS_PORT          //properties.get('port');      - 8080

var connection_string = '127.0.0.1:27017/bookingadvisor';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}

console.log ("port: " + PORT + " -- ip: " + DB_IP_NETWORK + " -- link: " + connection_string);

var database;
var myCollectionHouses;

var app = express();
app.use(cors());
app.use(bodyParser.json());

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

// var url_for_connect = URL + USER_MONGO + ":" + PASSWORD_MONGO + "@" + SERVER_MONGO + ":" + PORT_MONGO + "/" + DB_MONGO;
 
var url_for_connect = 'mongodb://' + connection_string;

// connect with authentication or not
function try_to_connect (err, db) {
    if (err) { 
        console.log("Error connecting to MongoDB. Aborting...");
        throw err;
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
