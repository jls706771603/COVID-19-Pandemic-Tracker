import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NewsItem from './NewsItem'
import { Layout } from './Layout'

const NewsList = () => {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    const getArticles = async () => {
      var axios = require("axios").default;

      var options = {
        method: 'GET',
        url: 'https://api.newscatcherapi.com/v2/search',
        params: { q: 'covid-19 in US', lang: 'en', sort_by: 'relevancy', page: '1' },
        headers: {
          'x-api-key': '67u97eRMuxbEfdwvd0ix41FXpdQggEHmB2NBKKY_DO4'
        }
      };

      axios.request(options).then(function (response) {
        const responses = axios.get('https://newsapi.org/v2/everything?q=covid-19%in%US&apiKey=e1703a5be6ef4af286b4497badb5d064%27')
        console.log(responses.data)
        setArticles(response.data.articles)
      }).catch(function (error) {
        console.error(error);
      });
    }
    getArticles()
  }, [])
  return (
    <Layout>
      <div className='newsBackground'>
        <div className='container'>
          {articles.map(article => {
            return (
              <NewsItem
                title={article.title}
                description={article.summary}
                url={article.link}
                urlToImage={article.media}
                publishedAt={article.published_date}
              />
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

export default NewsList