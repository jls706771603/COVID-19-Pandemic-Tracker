import pandas as pd
import requests
import io

# The url link must be a raw.####.com
urlUSA = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us.csv"
downloadUSA = requests.get(urlUSA).content
urlStates = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-states.csv"
downloadStates = requests.get(urlStates).content
urlCounties = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv"
downloadCounties = requests.get(urlCounties).content

# Turns the data into a pandas dataframe // Good for checking the contents
dfUSA = pd.read_csv(io.StringIO(downloadUSA.decode('utf-8')))
dfStates = pd.read_csv(io.StringIO(downloadStates.decode('utf-8')))
dfCounties = pd.read_csv(io.StringIO(downloadCounties.decode('utf-8')))

# Prints out the first 5 rows of data
print (dfUSA.head())
print (dfStates.head())
print (dfCounties.head())