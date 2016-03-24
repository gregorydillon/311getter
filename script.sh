curl "https://data.cityofnewyork.us/resource/fhrw-4uyv.csv?\$LIMIT=10000000&\$ORDER=created_date%20DESC" | head -n 600000 > /home/static/sites/311.lolspec.com/raw.csv

node transform.js /home/static/sites/311.lolspec.com/raw.csv /home/static/sites/311.lolspec.com/cleaned.csv
