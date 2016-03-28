curl "https://data.sfgov.org/resource/p8zf-gnjt.csv?\$LIMIT=10000000&\$ORDER=created_date%20DESC" | head -n 60000 > raw.csv"

node transform.js raw.csv cleaned.csv
