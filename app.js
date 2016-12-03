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


client.calls.create({
    url: 'http://' + request.headers.host + '/voice',
    to: num,
    from: "+16466528019 "
}, function(err, call) {
    process.stdout.write(call.sid);
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

exports.voice = function(request, response) {
    var twiml = new twilio.TwimlResponse();
 
    twiml.say('Hi there! Thanks for calling to wish Joe good luck this season. Please leave your message after the beep - you can end the message by pressing any button. Get ready!')
        .record({
            maxLength:120,
            action:'/recording'
        });
 
    response.send(twiml);
};
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
app.post('/voice', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  var twiml= new twilio.TwimlResponse();

  twiml.gather({ 
    numDigits: 1,
    action: '/gather'
  }, (gatherNode) => {
    gatherNode.say('For sales, press 1. For support, press 2.');
  });

  // If the user doesn't enter input, loop
  twiml.redirect('/voice');

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

// Create a route that will handle <Gather> input
app.post('/gather', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  var twiml = new twilio.TwimlResponse();

  // If the user entered digits, process their request
  if (request.body.Digits) {
    switch (request.body.Digits) {
      case '1': twiml.say('You selected sales. Good for you!'); break;
      case '2': twiml.say('You need support. We will help!'); break;
      default: 
        twiml.say('Sorry, I don\'t understand that choice.').pause();
        twiml.redirect('/voice');
        break;
    }
  } else {
    // If no input was sent, redirect to the /voice route
    twiml.redirect('/voice');
  }

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

// app.post('/', function(req, res) {
//     var twilio = require('twilio');
//     var twiml = new twilio.TwimlResponse();
//     twiml.say("Hello from pratik Twilio! Have fun.");




        
 
//     res.writeHead(200, {'Content-Type': 'text/xml'});
//     res.end(twiml.toString());
// });

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

