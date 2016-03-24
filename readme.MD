#311Getter

Scripts to download and transform NYC 311 data from the New York City Open Data Portal.

This set of scripts was built to facilitate ETL for the [NYC 311 Data Downloader](http://chriswhong.github.io/311plus).  

##script.sh

This shell script executes a CURL command to download the latest 600,000 rows of data from the NYC Open Data Portal using the API, saving it to a local directory on lolspec.com (digitalocean).  

```
curl "https://data.cityofnewyork.us/resource/fhrw-4uyv.csv?\$LIMIT=10000000&\$ORDER=created_date%20DESC" | head -n 600000 > /home/static/sites/311.lolspec.com/raw.csv

```

It then executes `transform.js` on the file.

##transform.js

This node script parses the raw data line by line, using regex to transform the 3 date/time fields into GMT times (Eastern time -5).  This step is necessary because CartoDB would treat the dates in the raw data as GMT, when they are actually local time.  (TODO: check the created_date of each row and offset -5 for standard time and -4 for daylight savings time)

The output is in a public directory at http://311.lolspec.com/cleaned.csv, which is grabbed daily by a CartoDB sync table.