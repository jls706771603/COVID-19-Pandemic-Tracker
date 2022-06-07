import React from 'react'
import './Newsitem.css'

const NewsItem = ({ title, description, url, urlToImage }) => {
  return (
    <div class="card">
      <div class="card-header">
        <img src={urlToImage} alt="rover" />
      </div>
      <div class="card-body">
        <span class="tag tag-blue">News Article</span>
        <h4>
          {title}
        </h4>
        <p>
          {description}
        </p>
        <p>
          <a className='clickLearnMore' href={url}>Learn More</a>
        </p>
      </div>
    </div>
  )
}

export default NewsItem