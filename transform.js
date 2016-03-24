var Mustache = require('mustache')
  , moment = require('moment')
  , fs = require('fs')
  , nodemailer = require('nodemailer')
  , LineByLineReader = require('line-by-line')
  ;

require('dotenv').load();

var readPath = process.argv[2];
var writePath = process.argv[3];
var notification_email = process.env.NOTIFICATION_EMAIL;

var rowCount = 0;

//configure email alert
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASS
    }
});

lr = new LineByLineReader(readPath);
writeFile = fs.createWriteStream(writePath);

lr.on('line', function(line) {
  lr.pause();

  rowCount++;
  process.stdout.write('Rows: ' + rowCount + '\r');

  line = line.replace(/(\d{4}\-\d\d\-\d\d[tT][\d:\.]*)/g, function(match) {
    var newTime = shiftTime(match);
    return shiftTime(match);
  });

  writeFile.write(line + '\n');
  lr.resume();
})

lr.on('end', function () {
  sendNotification('The 311 getter grabbed ' + rowCount + ' rows of data, and it\'s ready to download at 311.lolspec.com/cleaned.csv!');
});

//NYC Open data has timestamps in local time, but in ISO8601 format with no time zone.  
//CartoDB thinks these local times are GMT, so we must convert them to GMT
//TODO: check for daylight savings and offset 5 or 4 hours accordingly
function shiftTime(timestamp) {
  if(timestamp.length > 0 ) {
    timestamp = moment(timestamp).add(5,'hours').format();
  }

  return timestamp;
}

//sends an email notification
function sendNotification(message) {

  var mailOptions = {
      from: '311 Getter Script', 
      to: notification_email, 
      subject: '311 Script Complete', 
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
