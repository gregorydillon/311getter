'''
This python script is intended to work with 311getter
Im leaving it simple as an example "how to script"
It takes a csv file that is pulled by wget from data.gov. sf311
and run nightly on a cron job, and parses out just the mediaUrl


I began setting it up to also create a movie from the json, but
I didn't get it working.   So that explains some commented out
code.

'''
import json
from pprint import pprint

# from moviepy.editor import *

imageList=[]

with open('reports.json') as f:
    data = json.load(f)
    for index in range(len(data)):
        print(data[index]["address"])
        try:
            (data[index]["media_url"])
        except:
            print ("no photo")
        else:
            # print (data[index]["media_url"]["url"])
            imageList.append(data[index]["media_url"]["url"])
with open("mediaURls.txt","w") as file:
    for mediaUrl in imageList:
        file.write(mediaUrl+'\n')









