var express = require('express');
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

var PORT = process.env.PORT || 8089;

var app = express();

oracledb.autoCommit = true;

var connectionProperties = {
    user: process.env.DBAAS_USER_NAME || "oracleusr",
    password: process.env.DBAAS_USER_PASSWORD || "oracle",
    connectString: process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || "160.34.13.232:1521/PDB1.gse00002994.oraclecloud.internal"
};

function doRelease(connection) {
  connection.release(function (err) {
    if (err) {
      console.error(err.message);
    }
  });
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));

var router = express.Router();

router.use(function (request, response, next) {
  console.log("REQUEST:" + request.method + "   " + request.url);
  console.log("BODY:" + JSON.stringify(request.body));
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Http Method: GET
// URI        : /user_profiles
// Read all the user profiles
router.route('/user_profiles').get(function (req, res) {

    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }

        connection.execute("SELECT * FROM EMPLOYEE", {}, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error getting the user profile",
                    detailed_message: err.message
                }));
				doRelease(connection);
            } 
            res.contentType('application/json').status(200);
            res.send(JSON.stringify(result.rows));
            // Release the connection
			doRelease(connection);
        });
    });
});

// Http method: GET
// URI        : /userprofiles/:EMAIL
// Read the profile of user given in :EMAIL
router.route('/user_profiles/:EMAIL').get(function (req, res) {

    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }

        connection.execute("SELECT * FROM EMPLOYEE WHERE EMAIL = :EMAIL", [req.params.EMAIL], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the user profile" : "User doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
				doRelease(connection);
            }
            res.contentType('application/json').status(200).send(JSON.stringify(result.rows));

            // Release the connection
            doRelease(connection);
        });
    });
});

// Http method: POST
// URI        : /user_profiles
// Creates a new user profile
router.route('/user_profiles').post(function (req, res) {

    if ("application/json" !== req.get('Content-Type')) {
        res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
            status: 415,
            message: "Wrong content-type. Only application/json is supported",
            detailed_message: null
        }));
        return;
    }
    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
			doRelease(connection);
        }
        connection.execute("INSERT INTO EMPLOYEE VALUES " +
            "(:EMPID, :FIRST_NAME, :LAST_NAME, :EMAIL, :SPECID, :TITLE, :DEPTID) " +
            [req.body.EMPID, req.body.FIRST_NAME, req.body.LAST_NAME,
                            req.body.EMAIL, req.body.SPECID, req.body.TITLE, req.body.DEPTID], {
                autoCommit: true,
                outFormat: oracledb.OBJECT // Return the result as Object
            },
            function (err, result) {
                if (err) {
                    // Error
                    res.set('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err.message.indexOf("ORA-00001") > -1 ? "User already exists" : "Input Error",
                        detailed_message: err.message
                    }));
					doRelease(connection);
                } 
                // Successfully created the resource
                res.status(201).set('Location', '/user_profiles/' + req.body.USER_NAME).end();
               
                // Release the connection
                doRelease(connection);
            });
    });
});

// Build UPDATE statement and prepare bind variables
var buildUpdateStatement = function buildUpdateStatement(req) {

    var statement = "",
        bindValues = {};
    if (req.body.EMPID) {
        statement += "EMPID = :EMPID";
        bindValues.EMPID = req.body.EMPID;
    }
    if (req.body.FIRST_NAME) {
        if (statement) statement = statement + ", ";
        statement += "FIRST_NAME = :FIRST_NAME";
        bindValues.FIRST_NAME = req.body.FIRST_NAME;
    }
    if (req.body.LAST_NAME) {
        if (statement) statement = statement + ", ";
        statement += "LAST_NAME = :LAST_NAME";
        bindValues.LAST_NAME = req.body.LAST_NAME;
    }
    if (req.body.EMAIL) {
        if (statement) statement = statement + ", ";
        statement += "EMAIL = :EMAIL";
        bindValues.EMAIL = req.body.EMAIL;
    }
    if (req.body.SPECID) {
        if (statement) statement = statement + ", ";
        statement += "SPECID = :SPECID";
        bindValues.SPECID = req.body.SPECID;
    }
    if (req.body.TITLE) {
        if (statement) statement = statement + ", ";
        statement += "TITLE = :TITLE";
        bindValues.TITLE = req.body.TITLE;
    }
	    if (req.body.DEPTID) {
        if (statement) statement = statement + ", ";
        statement += "DEPTID = :DEPTID";
        bindValues.DEPTID = req.body.DEPTID;
    }

    statement += " WHERE EMAIL = :EMAIL";
    bindValues.EMAIL = req.params.EMAIL;
    statement = "UPDATE EMPLOYEE SET " + statement;

    return {
        statement: statement,
        bindValues: bindValues
    };
};

// Http method: PUT
// URI        : /user_profiles/:EMAIL
// Update the profile of user given in :EMAIL
router.route('/user_profiles/:EMAIL').put(function (req, res) {

    if ("application/json" !== req.get('Content-Type')) {
        res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
            status: 415,
            message: "Wrong content-type. Only application/json is supported",
            detailed_message: null
        }));
        return;
    }

    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            doRelease(connection);
        }

        var updateStatement = buildUpdateStatement(req);
        connection.execute(updateStatement.statement, updateStatement.bindValues, {
                autoCommit: true,
                outFormat: oracledb.OBJECT // Return the result as Object
            },
            function (err, result) {
                if (err || result.rowsAffected === 0) {
                    // Error
                    res.set('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err ? "Input Error" : "User doesn't exist",
                        detailed_message: err ? err.message : ""
                    }));
					doRelease(connection);
                }
                // Resource successfully updated. Sending an empty response body. 
                res.status(204).end();
                
                // Release the connection
                doRelease(connection);
            });
    });
});

// Http method: DELETE
// URI        : /userprofiles/:EMAIL
// Delete the profile of user given in :EMAIL
router.route('/user_profiles/:EMAIL').delete(function (req, res) {

    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            doRelease(connection);
        }

        connection.execute("DELETE FROM EMPLOYEE WHERE EMAIL = :EMAIL", [req.params.EMAIL], {
            autoCommit: true,
            outFormat: oracledb.OBJECT
        }, function (err, result) {
            if (err || result.rowsAffected === 0) {
                // Error
                res.set('Content-Type', 'application/json');
                res.status(400).send(JSON.stringify({
                    status: 400,
                    message: err ? "Input Error" : "User doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
				doRelease(connection);
            }
            // Resource successfully deleted. Sending an empty response body. 
            res.status(204).end();
            
            // Release the connection
            doRelease(connection);

        });
    });
});

app.use('/', router);
app.listen(PORT);

console.log("Server started in port:" + PORT + ", using connection: " + JSON.stringify(connectionProperties));
