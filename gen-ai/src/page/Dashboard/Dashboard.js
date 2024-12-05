import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchNews();
    }
  }, [navigate]);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/news', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setArticles([]);
    }
  };


/*
// In your Dashboard component, update the NewsCard component:
const NewsCard = ({ title, description, imageUrl, url }) => (
  <div className="news-card" onClick={() => window.open(url, '_blank')}>
    <div className="card-image">
      {imageUrl ? (
        <img src={imageUrl} alt={title} onError={(e) => e.target.style.display = 'none'} />
      ) : (
        <div className="image-placeholder">No Image Available</div>
      )}
    </div>
    <div className="news-content">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    <button className="read-more" onClick={() => handleReadMore(url)}>Read More</button>
  </div>
);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Recent Innovations in Generative AI</h2>
        <div className="latest-news">
        </div>
      </div>
      <div className="news-grid">
        {Array.isArray(articles) && articles.length > 0 ? (
          articles.map((article, index) => (
            <NewsCard
              key={index}
              title={article.title}
              description={article.description}
            />
          ))
        ) : (
          <div className="no-articles">
            <p>No articles available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
}*/


const NewsCard = ({ title, description, imageUrl, url }) => (
  <div className="news-card">
    <div className="card-image-container">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title} 
          className="card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-image.png'; // Add a placeholder image
          }}
        />
      ) : (
        <div className="image-placeholder">No Image Available</div>
      )}
    </div>
    <div className="news-content">
      <h3>{title}</h3>
      <p>{description}</p>
      <button 
        className="read-more-btn"
        onClick={(e) => {
          e.preventDefault();
          if (url) {
            window.open(url, '_blank', 'noopener noreferrer');
          }
        }}
      >
        Read More
      </button>
    </div>
  </div>
);

return (
  <div className="dashboard-container">
    <div className="dashboard-header">
      <h2>Recent Innovations in Generative AI</h2>
      <div className="latest-news">
        <h3>Latest News</h3>
      </div>
    </div>
    <div className="news-grid">
      {Array.isArray(articles) && articles.length > 0 ? (
        articles.map((article, index) => (
          <NewsCard
            key={index}
            title={article.title}
            description={article.description}
            imageUrl={article.imageUrl}
            url={article.url}
          />
        ))
      ) : (
        <p>No articles available</p>
      )}
    </div>
  </div>
);
}




export default Dashboard;
