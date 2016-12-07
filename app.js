'use strict';

const express = require('express');
const twilio = require('twilio');
const urlencoded = require('body-parser').urlencoded;

let app = express();

// Parse incoming POST params with Express middleware
app.use(urlencoded({ extended: false }));

// Create a route that will handle Twilio webhook requests, sent as an 
// HTTP POST to /voice in our application
app.post('/voice', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  let twiml = new twilio.TwimlResponse();
  twiml.gather({ 
    finishOnKey:'*',
    numDigits: 5,
    action: '/gather'
    
  }, (gatherNode) => {
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
    switch (request.body.Digits) {
      case '11111': twiml.say('wellcome to help desk!'); break;
      case '22222': twiml.say('wellcome to help desk!'); break;
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
// Create an HTTP server and listen for requests on port 3000
app.listen(3000);

module.exports = app;



