import streamlit as st
import json
import requests
from newspaper import Article
from transformers import pipeline


url = "https://free-news.p.rapidapi.com/v1/search"

querystring = {"q":"Elon Musk","lang":"en","page":1, "page_size":5}

headers = {
	"X-RapidAPI-Host": "free-news.p.rapidapi.com",
	"X-RapidAPI-Key": "b1412776d0msh1e4578dd34439e6p18a183jsn76a2823d7cb6"
}

response = requests.request("GET", url, headers=headers, params=querystring)

print(response.text)

article_titles = []
article_texts = []
article_summaries = []





st.set_page_config(page_title='Short News App', layout='wide', initial_sidebar_state = 'expanded')
st.title('Welcome to Short News App n Tired of reading long articles? This app summarizes news articles for you and gives you short crispy to the point news based on your search n (This is a demo app and hence is deployed on a platform with limited computational resources. Hence the number of articles  this app can fetch is limited to 5)')
summarizer = pipeline("summarization")
with st.sidebar.form(key='form1'):
    search = st.text_input('Search your favorite topic:')
    submitted = st.form_submit_button("Submit")
    if submitted:
        try:
            url = "https://free-news.p.rapidapi.com/v1/search"
            querystring = {"q":search, "lang":"en", "page":1, "page_size":5}
            headers = {'x-rapidapi-host':"free-news.p.rapidapi.com", 'x-rapidapi-key':"b1412776d0msh1e4578dd34439e6p18a183jsn76a2823d7cb6"}
            response = requests.request("GET", url, headers=headers, params = querystring)
            response_dict = json.loads(response.text)
            links = [response_dict['articles'][i]['link'] for i in range(len(response_dict['articles']))]
            for link in links:
                news_article = Article(link, language = 'en')
                news_article.download()
                news_article.parse()
                article_titles.append(news_article.title)
                article_texts.append(news_article.text)
            for text in article_texts:
                article_summaries.append(summarizer(text)[0]['summary_text'])
        except:
            print("Try with new search")
for i in range(len(article_texts)):
    st.header(article_titles[i])
    st.subheader('Summary of Article')
    st.markdown(article_summaries[i])
    with st.expander('Full Article'):
        st.markdown(article_texts[i])