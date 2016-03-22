var Mustache = require('mustache')
  , moment = require('moment')
  , fs = require('fs')
  , nodemailer = require('nodemailer')
  , csv = require('csv-streamify')
  ;

require('dotenv').load();

var readPath = process.argv[2];
var writePath = process.argv[3];

var rowCount = 0;

//configure email alert
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASS
    }
});

readFile = fs.createReadStream(readPath);
writeFile = fs.createWriteStream(writePath);


parser = csv({objectMode: true});

parser.on('data', function (line) {
  rowCount++;
  process.stdout.write('Rows: ' + rowCount + '\r');

  line.forEach(function(item, i) {
    line[i] = item.replace(/(\d{4}\-\d\d\-\d\d[tT][\d:\.]*)/g, function(match) {
      var newTime = shiftTime(match);
      return shiftTime(match);
    });
  }); 

  writeFile.write(line.join() + '\n');
});

//go!
readFile.pipe(parser)


//shift time to GMT
function shiftTime(timestamp) {
  if(timestamp.length > 0 ) {
    timestamp = moment(timestamp).add(5,'hours').format('MM/DD/YYYY HH:mm:ss');
  }

  return timestamp;
}

//sends an email
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
