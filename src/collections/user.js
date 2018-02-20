var database = require('../db.js');
var bcrypt = require('bcrypt');
var app = database.application();
var mongo = database.mongo();

/*var hash = bcrypt.hashSync("bacon");
 
bcrypt.compareSync("bacon", hash); // true
bcrypt.compareSync("veggies", hash); // false
*/

cryptPassword = function(password, callback) {
   bcrypt.genSalt(10, function(err, salt) {
    if (err) 
      return callback(err);

    bcrypt.hash(password, salt, function(err, hash) {
      return callback(err, hash);
    });
  });
};

comparePassword = function(plainPass, hashword, callback) {
   bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
       return err == null ?
           callback(null, isPasswordMatch) :
           callback(err);
   });
};


module.exports = {

    registerUser : function (req, res) {
    	console.log(req.body);
    	cryptPassword(req.body.parola, function (err, hash) {
    		if (err) {
    			console.log("DA");
    			res.status(500).json(err);
    		}
    		else {
    			var bodyReq = req.body;
    			delete(bodyReq.parola);
    			bodyReq.parola = hash;
    			database.connectUsersDB().insert(bodyReq, function(err, result) {
            		if (err) {
            			console.log(err);
            			console.log(result);
                		res.status(500).json(err);
            		}
            		else
                		res.status(200).json(result);
        		});
    		}
    	});
    },
    /*uthenticationUser : function(req, res) {
    	
    	var email = {email : req.params.email};
    	database.connectUsersDB(email).toArray (function (err, result) {
			if (err)
				res.status(404).end("Not found email");
			else {	
				console.log(result);
				res.status(200).json(result);
			}
		});
    },*/

    authenticationUser : function (req, res) {
    	var email = {email : req.query.email};
    	var password = {parola : req.query.password};
    	console.log(req.query.email + " --- " + req.query.password);
    	database.connectUsersDB().find(email).toArray (function (err, result) {
			if (err)
				res.status(404).end("Not found email");
			else if (result[0] == null) 
				res.status(404).end("Not found email");
			else {	
				console.log(result);

				comparePassword(req.query.password, result[0].parola, function (err, isPasswordMatch) {
    				if (err) {
    					res.status(500).json(err);
    				}
    				else if (isPasswordMatch) {
    					delete(result[0].Parola);
						delete(result[0]._id);
                    	res.status(200).json(result[0]);
					}
					else 
						res.status(404).end("Not found email");
        		});
    		}
    	});
    },

    gett : function (req, res) {
    	res.status(200).json({"Status" : "OK"});
    }
}



