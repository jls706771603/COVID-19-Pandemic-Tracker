# Python Pseudocode
import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="123",
    database="CovidTrackerDatabase"
)

name, avgCases, currentCases, currentDate, currentDeath, currentMandate = None, None, None, None, None, None

db.autocommit = True
mycursor = db.cursor()

mycursor.execute("CREATE TABLE State (Name TINYTEXT PRIMARY KEY NOT NULL AUTO_INCREMENT, AvgCases DOUBLE, Cases DOUBLE, Date CHAR(20), Death DOUBLE, Mandate CHAR(50))")
mycursor.execute("CREATE TABLE County (Name TINYTEXT PRIMARY KEY NOT NULL AUTO_INCREMENT, AvgCases DOUBLE, Cases DOUBLE, Date CHAR(20), Death DOUBLE, Mandate CHAR(50))")
mycursor.execute("CREATE TABLE Social (Username CHAR(30) PRIMARY KEY NOT NULL AUTO_INCREMENT, Comment TEXT, Likes DOUBLE, Time CHAR(40))")

# Example of Inserting Data
cmd = "INSERT INTO State (Name, AvgCases, Cases, Date, Death, Mandate) VALUES (%s,%s,%s,%s,%s,%s)"
data = (name, avgCases, currentCases, currentDate, currentDeath, currentMandate)
mycursor.execute(cmd,data)

mycursor.execute("DROP TABLE State")
mycursor.execute("DROP TABLE County")
mycursor.execute("DROP TABLE Social")

mycursor.close()
db.close()