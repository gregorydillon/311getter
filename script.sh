<<<<<<< HEAD
wget -O reports.json "http://data.sfgov.org/resource/qer8-n8u9.json"
#  curl  "http://data.sfgov.org/resource/qer8-n8u9.csv" | head -n 100 > /home/gdillon/311getter/reports.csv

#   node transform.js /home/gdillon/sf311/csv/raw.csv /home/gdillon/sf311/csv/cleaned.csv
=======
curl 'https://data.sfgov.org/resource/p8zf-gnjt.csv?\$LIMIT=10000000&\$ORDER=created_date%20DESC' | head -n 60000 > raw.csv

node transform.js raw.csv cleaned.csv
>>>>>>> 3ef5d5b79e4e22de559c390d6a05415b4df40e77
