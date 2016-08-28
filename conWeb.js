
var mysql = require("mysql");

// First connection is made to DB.
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rhythm29",
    database: "vote"
});

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/Script'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
//console.log(__dirname)
// app.get('/test', function(req, res) {
//         res.sendFile(path.join(__dirname, 'test.html'));

// });

app.post('/data', function(req, res) {
    //console.log(req.body);
    var id = Math.floor(Math.random() * 1000000000)
    addToDatabase(req.body.ques,id);
    res.redirect('/vote?quesid='+ id);

});

app.post('/pollData', function(req, res) {


    addToDBResult(req.body.quesid, req.body.rb);
    res.redirect('/result?quesid='+req.body.quesid);

});

app.get('/vote', function (req, res) {
    con.query('select * from question where qid =' +req.query.quesid , function(err, rows, fields){
    //console.log(query);
    var str = '<h2>Polling API</h2>'+'<h3>'+ rows[0].qname +'</h3>'+'<form action = "/pollData" method = "POST"'+ '<br>' + '<input type="radio" value="yes" name = "rb"/>YES'+ '<br>'+'<input type="radio" value="no" name="rb"/>NO';
    str = str + '<input type="hidden" name="quesid" value="'+rows[0].qid;
    str = str + '"<br>' + '<br>' + '<button type="submit">Vote</button></form>';
    res.send(str);
    });
});

app.get('/result', function(req, res){
    //console.log(req);
    var query = 'select qname, yesCount, noCount from question, result where question.qid = result.qid and question.qid = "'+req.query.quesid+'"';
    //console.log(query);
    con.query(query, function(err, result) {
    console.log(err);
    var str = '<h2>Poll Resuts</h2>'+ result[0].qname+ '<br>'+'YES' +' ' + result[0].yesCount+'<br>'+ 'NO'+ ' '+result[0].noCount; 
    res.send(str);
}); 
});



app.listen(3000,function(){
    console.log("listening at "+3000); 
});

function addToDatabase(ques, id){
    var query  = "insert into question(qname,qid) values ('"+ques+"',"+id+")";
    var query1 = "insert into result(qid,yesCount,noCount) values('"+id+"',0,0)";
	  console.log(query1);
	  con.query(query, function(err, result) {
    console.log(err);
});
 con.query(query1, function(err, result) {
    console.log(err);
});   
}

function addToDBResult(id,rb){
  var query = "update result set "+rb+"Count = "+rb+"Count+1 where qid ="+id;
  console.log(query);
  con.query(query, function(err, result) {
    console.log(err);
}); 
}