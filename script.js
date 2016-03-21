var moment = require('moment')
  , Mustache = require('mustache')
  , request = require('request')
  , fs = require('fs')
  , split2 = require('split2')
  , through2 = require('through2')
  , nodemailer = require('nodemailer')
  ;

require('request-debug')(request);
require('dotenv').load();

//Socrata seems to not cooperate when I set this to 1000000
var sourceLimit = 600000;

var days = process.argv[2]
  , savePath = process.argv[3];

var rowCount = 0;

//prepare to send an email alert
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASS
    }
});



//get the date from 90 days ago
var pastDate = moment().subtract(days, 'days').format('YYYY-MM-DD')

var sourceTemplate = 'https://data.cityofnewyork.us/resource/fhrw-4uyv.csv?$LIMIT={{sourceLimit}}&$ORDER=created_date%20DESC&$WHERE=created_date>=%27{{pastDate}}%27';

//build a SODA API call... eww
var sourceURL = Mustache.render( sourceTemplate, { 
  sourceLimit: sourceLimit,
  pastDate: pastDate 
});

console.log('Downloading {{days}} of 311 data from {{sourceURL}}', {
  days: days,
  sourceURL: sourceURL
});

var options = {
  url: sourceURL
}

//transform function, finds all timestamps and converts them to GMT
var transform = through2(function(chunk, encoding, cb) {
  rowCount++;

  chunk = chunk.toString();

  chunk = chunk.replace(/(\d{4}\-\d\d\-\d\d[tT][\d:\.]*)/g, function(match) {
    var newTime = shiftTime(match);
    return shiftTime(match);
  });

  //re-add the newline character
  chunk += '\n';

  cb(null, chunk);
})
  .on('error', function(err) {
  console.log(err, err.toString());
});

//GET the API call and pipe it to the response
request.get(sourceURL)
  .on('response', function(response) {
    console.log(response.statusCode);
    console.log(response.headers);
  })
  .on('end', function() {
    console.log('Done-zo, sending an email');
    sendNotification(
      Mustache.render('The 311 script ran, saved {{rowCount}} rows to {{savePath}}', {
        rowCount: rowCount,
        savePath: savePath
      })
    )
  })
  .pipe(split2(), {end: false})
  .pipe(transform)
  .pipe(fs.createWriteStream(savePath))


//shift time to GMT
function shiftTime(timestamp) {
  if(timestamp.length > 0 ) {
    timestamp = moment(timestamp).add(5,'hours').format('MM/DD/YYYY HH:mm:ss');
  }

  return timestamp;
}

function sendNotification(message) {
  // setup e-mail data with unicode symbols 

  var mailOptions = {
      from: 'Chris Whong <chris.m.whong@gmail.com>', // sender address 
      to: 'chris.m.whong@gmail.com', // list of receivers 
      subject: '311 Script Complete', // Subject line 
      text: message
  };
   
  // send mail with defined transport object 
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
}
