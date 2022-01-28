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
df1 = pd.read_csv("us-counties-recent.csv")

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

#st.dataframe(df)


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
"state == @state | name == @name")

st.header("Filtered Cases")

st.write('Data Dimension: ' + str(df_selection.shape[0]) + ' rows and ' + str(df_selection.shape[1]) + ' columns.')

st.dataframe(df_selection)

def filedownload(df):
	csv = df.to_csv(index=False)
	b64 = base64.b64encode(csv.encode()).decode()
	href = f'<a href="data:file/csv;base64,{b64}" download="cases.csv">Download CSV File</a>'
	return href
	
st.markdown(filedownload(df_selection), unsafe_allow_html=True)

# map

state_geo = "states.geojson"
state_data = pd.read_csv("us-states.csv")

choice = ["cases", "deaths"]
choice_selected = st.selectbox("Select choice", choice)

#state_data.isnull().values.any()

date_max = max(state_data['date'])

#state_data['fips'] = state_data['fips'].fillna(0)
#state_data = state_data[state_data['fips'].notna()]

latest_state_data = state_data[state_data['date'] == date_max]
#latest_state_data_new = latest_state_data.drop(['fips'], axis=1)
#latest_state_data_new['fips'] = latest_state_data['fips'].astype('str')

#latest_state_data['deaths'] = latest_state_data['deaths'].astype('int').astype('str')

m = folium.Map(location=[39,-98], zoom_start=4)

folium.Choropleth(
    geo_data=state_geo,
    name="choropleth",
    data=latest_state_data,
    columns=["fips", choice_selected],#, choice_selected],
    key_on="feature.properties.STATEFP",
    fill_color="YlGn",
    fill_opacity=0.7,
    line_opacity=0.2,
    legend_name=choice_selected,
).add_to(m)

folium.features.GeoJson('states.geojson',
	name="State", popup=folium.features.GeoJsonPopup(fields=["NAME"])).add_to(m)
	
folium.LayerControl().add_to(m)
		
folium_static(m, width=800, height=500)

#
#json1 = "county.geojson"
#
#m = folium.Map(location=[39,-98], zoom_start=4)
#			   
##choice = ["cases", "deaths"]
##choice_selected = st.selectbox("Select choice", choice)
#
#folium.Choropleth(
#    geo_data=json1,
#    name="choropleth",
#    data=df1,
#    columns=["fips", "deaths"],#"GEOID",choice_selected],
#    key_on="feature.properties.GEOID",
#    fill_color="YlGn",
#    fill_opacity=0.7,
#    line_opacity=0.2,
#    #legend_name=choice_selected
#).add_to(m)
#
#
##folium.features.GeoJson('county.geojson',
#	#name="County", popup=folium.features.GeoJsonPopup(fields=["COUNTY_STATE_NAME"])).add_to(m)
#						
#folium.LayerControl().add_to(m)
#
#folium_static(m, width=800, height=500)
#
#