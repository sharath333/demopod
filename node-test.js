var express = require('express');
var bodyParser = require('body-parser');

var PORT = process.env.PORT || 8089;

var app = express();

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

var jsonQueryResult =[ {
PODQUESTIONID: 10,
PODANSWERID: 10,
POD_QUESTION: "Oracle Application Container Cloud Service provide runtime platform for",
ANSWER: "JAVA SE"
},
  {
PODQUESTIONID: 10,
PODANSWERID: 20,
POD_QUESTION: "Oracle Application Container Cloud Service provide runtime platform for",
ANSWER: "PHP"
},
{
PODQUESTIONID: 10,
PODANSWERID: 30,
POD_QUESTION: "Oracle Application Container Cloud Service provide runtime platform for",
ANSWER: "Node.JS"
},
  {
PODQUESTIONID: 10,
PODANSWERID: 40,
POD_QUESTION: "Oracle Application Container Cloud Service provide runtime platform for",
ANSWER: "All of the above"
},
  {
PODQUESTIONID: 20,
PODANSWERID: 50,
POD_QUESTION: "Mobile Cloud Services can be used by applications built using .net ",
ANSWER: "True"
},
  {
PODQUESTIONID: 20,
PODANSWERID: 60,
POD_QUESTION: "Mobile Cloud Services can be used by applications built using .net ",
ANSWER: "False"
},
  {
PODQUESTIONID: 30,
PODANSWERID: 70,
POD_QUESTION: "Oracle Container Cloud services can run the following containers ",
ANSWER: "Docker container"
},
  {
PODQUESTIONID: 30,
PODANSWERID: 80,
POD_QUESTION: "Oracle Container Cloud services can run the following containers ",
ANSWER: "VMware "
},
  {
PODQUESTIONID: 30,
PODANSWERID: 90,
POD_QUESTION: "Oracle Container Cloud services can run the following containers ",
ANSWER: "Azure"
},
  {
PODQUESTIONID: 30,
PODANSWERID: 100,
POD_QUESTION: "Oracle Container Cloud services can run the following containers ",
ANSWER: "None of the above"
}];

console.log(" ");
console.log( "The jsonQueryResult=" + JSON.stringify(jsonQueryResult));
console.log(" ");

var qAndA = {PODQUESTIONID: 10, POD_QUESTION: "", ANSWER: []};
var anAnswer = {PODANSWERID: 10, ANSWER: ""};
var jsonResult = [];
var i = 0; // index for looping through all the query results
var j = 0; // Index for the array holding the results to return

while ( i < jsonQueryResult.length )
{
    var currentQID = jsonQueryResult[i]["PODQUESTIONID"];
    
    console.log("currentQID=" + currentQID );
    console.log(" ");
    
    qAndA = new Object();
    
    qAndA["PODQUESTIONID"] = currentQID;
    qAndA["POD_QUESTION"] = jsonQueryResult[i]["POD_QUESTION"];
    qAndA["ANSWER"] = [];
    
    while ( i < jsonQueryResult.length && currentQID == jsonQueryResult[i]["PODQUESTIONID"] ) {
        anAnswer = new Object();
        
        anAnswer["PODANSWERID"] = jsonQueryResult[i]["PODANSWERID"];
        anAnswer["ANSWER"] = jsonQueryResult[i]["ANSWER"];
        qAndA["ANSWER"].push(anAnswer);
        
        console.log("Inner loop: i=" + i + "anAnswer=" + JSON.stringify(anAnswer));
        
        i++;
    }
    // Add this question and its answers to the end reults array
    //
    console.log(" ");
    console.log("Processed Question with Answers: " + JSON.stringify(qAndA));
    console.log(" ");
    
    jsonResult.push(qAndA);
    j++;
}

console.log("About to return result:" + JSON.stringify(jsonResult));
console.log(" ");

app.use('/', router);
app.listen(PORT);

console.log( "jsonResult=" + JSON.stringify(jsonResult));

console.log("Server started in port:" + PORT);


