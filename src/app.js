
// API and Version
const API = "/api";
const VERSION = "/v1";

// Load local Javascript modules
var database = require('./db.js');
var houses = require('./collections/houses.js');
var users = require('./collections/user.js');

// Entity from URL
const HOUSES = "/houses/";
const USER = "/users/"

const GATEWAY_ID = ":houseId";
const EMAIL = ":email";
const PASSWORD = ":password";

// Base gateway URL
const BASE_URL = API + VERSION; // http://localhost:8080/api/v1/


var app = database.application();



// HOUSES
app.post (BASE_URL + HOUSES, houses.createHouse);
app.get (BASE_URL + HOUSES, houses.getHouse);

app.post (BASE_URL + USER, users.registerUser);
app.get (BASE_URL + "/authentication", users.authenticationUser);

app.get (BASE_URL + USER, users.gett);