var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongodb')
var mongojs = require('mongojs');
var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();


//view engine setup
var db = mongojs('mongodb://pratik:pratik@ds059496.mlab.com:59496/heroku_9rflxd4s', ['details']);

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.post('/view1', function(req, res) {
    console.log(req.body.search);
    res.end();
    var accountSid = 'AC5b3a64ad844dfbb918812897bcf2a1ce'; 
    var authToken = '8c055fe15f07533ff69388be72b93b16';  

    var twilio = require('twilio');
    var client = new twilio.RestClient(accountSid, authToken);
if (req.body.search) 
{
  var num = req.body.search;

var promise = client.makeCall({
    to:num, // a number to call
    from:'+16466528019', // a Twilio number you own
    url:'https://demo.twilio.com/welcome/voice' // A URL containing TwiML instructions for the call
});

// You can assign functions to be called, at any time, after the request to
// Twilio has been completed.  The first function is called when the request
// succeeds, the second if there was an error.
promise.then(function(call) {
    console.log('Call success! Call SID: '+call.sid);
}, function(error) {
    console.error('Call failed!  Reason: '+error.message);
});

};
});


app.get('/posts', function(req, res)
{
   db.details.find(function(err, data) 
  {

     console.log(data);
     res.json(data);
  });



});


app.get('/', function(req, res) {
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
       if (req.body.Body == 'Help') {
      twiml.say("Hello from pratik Twilio! Have fun.");
     }
     // else
     // {
   //    var string = req.body.Body;
   //      var from = req.body.From;

   //    string = string.split(" ");
   //    var stringArray = new Array();
   //    for(var i =0; i < string.length; i++)
   //    {
   //    stringArray.push(string[i]);

   //    }
   //    var str = stringArray[1].toLowerCase();

   //    var zip = stringArray[0];

   // if (str == 'a') {
   //          twiml.message('Thanks for your feedback');
            
   //        db.details.insert( { number: from, zip: zip, response: "Extermely Satisfied"  } )

   //  } 
    
   //  else if(str == 'b') {
   //      twiml.message('Thanks for your feedback');
        
   //      db.details.insert( { number: from, zip: zip, response: "Moderately Satisfied"  } )
    
   //   } 
   //   else if(str == 'c') 
   //   {

   //      twiml.message('Thanks for your feedback');
        
   //      db.details.insert( { number: from, zip: zip, response: "Not at all Satisfied"  } )
     // }

     else 
     {
        twiml.message('Invalid Response try again.');
    }



     

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

app.post('/', function(req, res) {
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
       if (req.body.Body == 'Help') {
      twiml.say("Hello from pratik Twilio! Have fun.");
     }
   //   else
   //   {
   //    var string = req.body.Body;
   //      var from = req.body.From;

   //    string = string.split(" ");
   //    var stringArray = new Array();
   //    for(var i =0; i < string.length; i++)
   //    {
   //    stringArray.push(string[i]);

   //    }
   //    var str = stringArray[1].toLowerCase();

   //    var zip = stringArray[0];

   // if (str == 'a') {
   //          twiml.message('Thanks for your feedback');
            
   //        db.details.insert( { number: from, zip: zip, response: "Extermely Satisfied"  } )

   //  } 
    
   //  else if(str == 'b') {
   //      twiml.message('Thanks for your feedback');
        
   //      db.details.insert( { number: from, zip: zip, response: "Moderately Satisfied"  } )
    
   //   } 
   //   else if(str == 'c') 
   //   {

   //      twiml.message('Thanks for your feedback');
        
   //      db.details.insert( { number: from, zip: zip, response: "Not at all Satisfied"  } )
   //   }

     else 
     {
        twiml.message('Invalid Response try again.');
    }




        
 
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
