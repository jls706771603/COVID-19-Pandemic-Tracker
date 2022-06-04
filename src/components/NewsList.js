import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NewsItem from './NewsItem'

const NewsList = () => {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    const getArticles = async () => {
      const response = await axios.get('https://newsapi.org/v2/everything?q=covid-19%in%US&apiKey=e1703a5be6ef4af286b4497badb5d064')
      console.log(response)
      setArticles(response.data.articles)
    }
    getArticles()
  }, [])
  return (
    <div className='newsBackground'>
      <div className='container'>
        {articles.map(article => {
          return (
            <NewsItem
              title={article.title}
              description={article.description}
              url={article.url}
              urlToImage={article.urlToImage}
              publishedAt={article.publishedAt}
            />
          )
        })}
      </div>
    </div>
  )
}

export default NewsList
