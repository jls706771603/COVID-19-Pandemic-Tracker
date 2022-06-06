import React from 'react'
import './Newsitem.css'

var flag = false;
let date = ""
var currentTime = new Date();

const NewsItem = ({ title, description, url, urlToImage, publishedAt }) => {
  flag = false;
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  date = new Date(publishedAt).toLocaleDateString([], options);
  currentTime = new Date()
  currentTime.setDate(currentTime.getDate() - 3)
  if ((new Date(publishedAt)).getTime() < currentTime.getTime()) {
    flag = true;
  }

  return (
    <div class="card">
      <div class="card-header">
        <img src={urlToImage} alt="rover" />
      </div>
      <div class="card-body">
        <div class="tag-splitter">
          <span class="tag tag-blue">News Article</span>
          {flag ? <div></div> : <span class="tag tag-new">New!</span>}
        </div>
        <h4>
          {title}
        </h4>
        <p>
          {description}
        </p>
        <p className='published'>
          Published: {date}
        </p>
        <div className='user'>
          <button class="newsbtn fourth" onClick={() => window.open(url, "_blank")}>Learn More</button>
        </div>
      </div>
    </div>
  )
}

export default NewsItem