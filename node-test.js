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

var jsonQueryResult =[ 
{
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
},
{
PODQUESTIONID: 40,
PODANSWERID: 200,
POD_QUESTION: "The path to peace is.. ",
ANSWER: "Money money money!"
},
{
PODQUESTIONID: 40,
PODANSWERID: 210,
POD_QUESTION: "The path to peace is.. ",
ANSWER: "Rock and roll!"
},
{
PODQUESTIONID: 40,
PODANSWERID: 220,
POD_QUESTION: "The path to peace is..  ",
ANSWER: "XBox"
},
{
PODQUESTIONID: 50,
PODANSWERID: 200,
POD_QUESTION: "Max Max's last name is... ",
ANSWER: "Smith"
},
{
PODQUESTIONID: 50,
PODANSWERID: 210,
POD_QUESTION: "Max Max's last name is... ",
ANSWER: "Brockatanski"
},
{
PODQUESTIONID: 50,
PODANSWERID: 220,
POD_QUESTION: "Max Max's last name is... ",
ANSWER: "He has no last name"
},
    {
PODQUESTIONID: 60,
PODANSWERID: 200,
POD_QUESTION: "My favorite Oracle Cloud Service is...",
ANSWER: "ACCS"
},
{
PODQUESTIONID: 60,
PODANSWERID: 210,
POD_QUESTION: "Max Max's last name is... ",
ANSWER: "OCS"
},
{
PODQUESTIONID: 60,
PODANSWERID: 220,
POD_QUESTION: "Max Max's last name is... ",
ANSWER: "AWS"
},
{
PODQUESTIONID: 70,
PODANSWERID: 200,
POD_QUESTION: "You should buy Oracle services because...",
ANSWER: "With a name like Oracle, it has to be good!"
},
{
PODQUESTIONID: 70,
PODANSWERID: 210,
POD_QUESTION: "You should buy Oracle services because...",
ANSWER: "I don't get paid unless you do."
},
{
PODQUESTIONID: 70,
PODANSWERID: 220,
POD_QUESTION: "You should buy Oracle services because...",
ANSWER: "All of the above."
},
{
PODQUESTIONID: 80,
PODANSWERID: 200,
POD_QUESTION: "Oracle offers THE best cloud",
ANSWER: "True"
},
{
PODQUESTIONID: 80,
PODANSWERID: 210,
POD_QUESTION: "You should buy Oracle services because...",
ANSWER: "False (You're fired!!!!)"
}    
];

console.log(" ");
console.log( "The jsonQueryResult=" + JSON.stringify(jsonQueryResult));
console.log(" ");

var qAndA = {PODQUESTIONID: 10, POD_QUESTION: "", ANSWER: []};
var anAnswer = {PODANSWERID: 10, ANSWER: ""};
var jsonResult = [];                                                // Array to hold all the questions. We return a subset of these.
var jsonRandomResult = [];                                          // Array to hold a randomized list of questions (its what we return)
var i = 0;                                                          // index for looping through all the query results
var j = 0;                                                          // Index for the array holding the results to return
var indexList = [];                                                 // Array to hold a list of random indexes

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

console.log("List of all questions and answers:" + JSON.stringify(jsonResult));
console.log(" ");

console.log("jsonResult.length=" + jsonResult.length);

// Create an array of random numbers ranging from 0 to the length of jsonResult
//
while(indexList.length < 6){
    var randomnumber = Math.ceil(Math.random()*jsonResult.length) - 1;
    
    // Make sure we don't have a negative number
    //randomnumber = randomnumber < 0 ? 0 : randomnumber;
    
    if(indexList.indexOf(randomnumber) > -1) continue;
    indexList[indexList.length] = randomnumber;
}
console.log("Random index list:" + JSON.stringify( indexList ));

for (var j=0; j < indexList.length; j++ ) {
    jsonRandomResult.push( jsonResult[indexList[j]] );
    console.log("Pushing..." + JSON.stringify(jsonResult[indexList[j]]) );
}

console.log(" ");
console.log("The randomized return will be: " + JSON.stringify(jsonRandomResult));
console.log(" ");

app.use('/', router);
app.listen(PORT);

//console.log( "jsonResult=" + JSON.stringify(jsonResult));

console.log("Server started in port:" + PORT);


