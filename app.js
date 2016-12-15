'use strict';

const express = require('express');
const twilio = require('twilio');
const urlencoded = require('body-parser').urlencoded;
const mongodb = require('mongodb');
const mongojs = require('mongojs');
let app = express();
var db = mongojs('mongodb://pratik:pratik@ds133438.mlab.com:33438/heroku_9rvcpdq9', ['users']);

app.use(urlencoded({ extended: false }));


app.post('/voice', (request, response) => 
{
  let twiml = new twilio.TwimlResponse();
  twiml.gather({ 
    finishOnKey:'*',
    numDigits: 5,
    action: '/gather'
    
  }, 
  (gatherNode) => {
    gatherNode.say(' Please enter your 5 digit ID and then press star.');
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
  let twiml = new twilio.TwimlResponse();

  // If the user entered digits, process their request
  if (request.body.Digits) {
    db.users.find({"userid": request.body.Digits}, function(err, data) 
  {
    if (data) 
    {
    twiml.say('wellcome %s to help desk', data.name); 
    }
   else
   {
        twiml.say('Sorry, invalid userid').pause();
        twiml.redirect('/voice');

    }
     
   });
    // switch (request.body.Digits) {
    //   case '11111': twiml.say('wellcome help desk'); break;
    //   case '22222': twiml.say('wellcome to help desk!'); break;
    //   default: 
    //     twiml.say('Sorry, I don\'t understand that choice.').pause();
    //     twiml.redirect('/voice');
    //     break;
    // }
  } else {
    // If no input was sent, redirect to the /voice route
    twiml.redirect('/voice');
  }

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});
// Create an HTTP server and listen for requests on port 3000
app.listen(3000);

module.exports = app;



