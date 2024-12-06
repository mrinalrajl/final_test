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
      <div className="latest-news">
        <h1>Latest News</h1>
        <h2>Some Context</h2>
        <div className='container'>
      <p>Recent innovations in Generative AI have significantly advanced the field, making it more accessible and powerful. In 2024, the focus shifted from demonstrations to practical applications, with models becoming more accurate, cost-effective, and multimodal. Enterprises began committing to this technology, with 40% of investments coming from permanent budgets. Multimodal capabilities expanded, allowing AI to process and generate multiple types of content simultaneously. Major players like OpenAI, Google, and Anthropic refined their algorithms, improving accuracy and reducing costs. For instance, OpenAI's o1 models achieved remarkable accuracy in complex tasks like mathematics.
        Despite these advancements, widespread implementation faced challenges. Up to 85% of generative AI projects failed due to technical, data, and operational issues. Integration with legacy systems and ensuring accuracy in diverse scenarios remained hurdles. However, the groundwork has been laid for more production-ready solutions in 2025.
        Looking ahead, we can expect more robust applications across industries, particularly in customer service automation, knowledge management, and personalized content creation. As generative AI matures, businesses must remain flexible, capitalizing on opportunities while addressing persistent challenges to ensure AI delivers on its transformative potential2. This dashboard is built using a modern tech stack, with React for the frontend and Node.js for the backend. The application uses JWT for authentication and communicates with the backend through RESTful API calls. The frontend is served by NGINX, while the backend runs on port 3000. The project incorporates accessibility features following WCAG guidelines and uses responsive design for cross-device compatibility. Data visualization is implemented using D3.js, with chart data fetched asynchronously from the backend. The entire application is hosted on a single server instance, ensuring efficient resource utilization and ease of maintenance.</p> </div>
      <h2>Recent Innovations in Generative AI</h2>
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