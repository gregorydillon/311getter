'''
The purpose of this program is to use python to pull data
from the SF311 system on a daily basis, and have the data
ready for some analysis

currently,  have this done by a cron job and the second step
is to prepare the data in python.
'''
import os
import requests
import json
import pprint

url = "http://data.sfgov.org/resource/qer8-n8u9.json"
imageList = []
pointList = []

reports = requests.get(url)
reports = reports.json()
# pprint.pprint(reports)
data = (reports)

for index in range(len(data)):
    # print(data[index]["address"])
    # pprint.pprint(data[index]["point"])
    try:
        (data[index]["media_url"])
    except:
        print ("no photo")
    else:
        # print (data[index]["media_url"]["url"])
        imageList.append(data[index]["media_url"]["url"])
        pointList.append(data[index]["point"]["latitude"])
        pointList.append(data[index]["point"]["longitude"])
with open("mediaURLs.txt","w") as file:
    for mediaUrl in imageList:
        file.write(mediaUrl+'\n')
        
with open("pointList.txt","w") as file:
    for point in pointList:
        file.write(point+'\n')
        
