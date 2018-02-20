var database = require('../db.js');
var app = database.application();
var mongo = database.mongo();


module.exports = {

    createHouse : function (req, res) {
    	console.log(req.body);
        database.connectHousesDB().insert(req.body, function(err, result) {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json(result);
        });
    },
    getHouse : function (req, res) {
    	database.connectHousesDB().find({}).toArray(function(err, result) {
   			if (err) 
   				throw err;
    		else
    			res.status(200).json(result);
    	});
    }
}