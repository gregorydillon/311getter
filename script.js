//for some reason the results are truncated when piping through node.  Trying to figure out if it is the request module or something else




var moment = require('moment');
var Mustache = require('mustache');
var request = require('request');
var fs = require('fs');

require('request-debug')(request);

  var sourceLimit = 600000;
  //get the date from 90 days ago
  var ninety_days_ago = moment().subtract(90, 'days').format('YYYY-MM-DD')

  var sourceTemplate = 'https://data.cityofnewyork.us/resource/fhrw-4uyv.csv?$LIMIT={{sourceLimit}}&$ORDER=created_date%20DESC&$WHERE=created_date>=%27{{ninety_days_ago}}%27';

    //build a SODA API call... eww
    var sourceURL = Mustache.render( sourceTemplate, { 
      sourceLimit: sourceLimit,
      ninety_days_ago: ninety_days_ago 
    });

    console.log(sourceURL);

    var options = {
      url: sourceURL,
      headers: {
        'Accept': '*/*',
        'User-Agent': 'curl/7.43.0'
      }
    }

    //GET the API call and pipe it to the response
    request.get(options)
    .on('response', function(response) {
      console.log(response.statusCode);
      console.log(response.headers);
    })
    .on('data', function(chunk) {
      //console.log(chunk)
    })
    .on('end', function() {
    console.log('end');
    })
    .pipe(fs.createWriteStream('/home/static/sites/311.lolspec.com/data.csv'))
    //.pipe(res);



// var port = process.env.PORT || 3000;

// var server = app.listen(port, function () {


//   console.log('Example app listening on port  ',port);
// });


