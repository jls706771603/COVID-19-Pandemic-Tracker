#!/usr/bin/env python
# coding: utf-8

# In[14]:


# import relevant packages
import geopandas as gpd
import pandas as pd
import matplotlib.pyplot as plt
import plotly.express as px
import streamlit as st
import base64
import folium
from streamlit_folium import folium_static

st.set_page_config(
    page_title="COVID-19 Dashboard",
    page_icon=":bar_chart:",
    layout="wide"
)



# In[15]:


# import data
df = pd.read_json("pandemic-tracker-1b4e2-default-rtdb-countyList-export.json")

df.to_csv('test.csv', index=False)


# In[16]:


df = pd.read_csv("test.csv")

df.head()


# In[17]:

st.markdown('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">', unsafe_allow_html=True)


st.markdown("""
<nav class="navbar fixed-top navbar-expand-lg navbar-dark" style="background-color: #3498DB;">
  <a class="navbar-brand" href="https://www.bellevuecollege.edu/" target="_blank">Bellevue College</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <a class="nav-link disabled" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="https://www.cdc.gov/coronavirus/2019-ncov/whats-new-all.html" target="_blank">News</a>
      </li>
	  <li class="nav-item">
        <a class="nav-link" href="https://covid.cdc.gov/covid-data-tracker/" target="_blank">CDC Tracker</a>
      </li>
    </ul>
  </div>
</nav>
""", unsafe_allow_html=True)

#st.title("COVID-19 Tracker")

st.write(
"""
# COVID-19 Tracker

Click the header of each column can sort the data. Try **Filters** on the left.

***
""")
st.header("Case Overview")

st.dataframe(df)


# In[ ]:


st.sidebar.header("Filters:")

state = st.sidebar.multiselect(
"Select the State:",
options=df["state"].unique(),
default="Washington"
)

name = st.sidebar.multiselect(
"Select the County:",
options=df["name"].unique(),
default="King"
)

df_selection = df.query(
"state == @state & name == @name")

st.header("Filtered Cases")

st.write('Data Dimension: ' + str(df_selection.shape[0]) + ' rows and ' + str(df_selection.shape[1]) + ' columns.')

st.dataframe(df_selection)

def filedownload(df):
	csv = df.to_csv(index=False)
	b64 = base64.b64encode(csv.encode()).decode()
	href = '<a href="data:file/csv;base64,{b64}" download="cases.csv">Download CSV File</a>'
	return href
	
st.markdown(filedownload(df_selection), unsafe_allow_html=True)

# map

"""
json1 = "gz_2010_us_050_00_20m.json"

folium.Map(location=[23.47,77.94], tiles='CartoDB positron', name="Light Map",
               zoom_start=5, attr="My Data attribution")
			   
choice = ["Cases", "Death"]
choice_selected = st.selectbox("Select choice", choice)

folium.Choropleth(
    geo_data=json1,
    name="choropleth",
    data=df,
    columns=["state_code",choice_selected],
    key_on="feature.properties.state_code",
    fill_color="YlOrRd",
    fill_opacity=0.7,
    line_opacity=.1,
    legend_name=choice_selected
).add_to(m)
folium.features.GeoJson('states_india.geojson',
                        name="States", popup=folium.features.GeoJsonPopup(fields=["st_nm"])).add_to(m)

folium_static(m, width=1600, height=950)
"""