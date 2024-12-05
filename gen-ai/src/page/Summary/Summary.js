/*
/// Basic Code


import React, { useEffect, useState } from 'react';

function Summary() {
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    fetch('/generative_ai_summary.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setSummaryData(data))
      .catch(error => console.error('Error loading summary:', error));
  }, []);

  if (!summaryData) return <div>Loading...</div>;

  return (
    <div className="reports-container">
      <h1>{summaryData.title}</h1>
      <div className="report-sections">
        {summaryData.sections.map((section, index) => (
          <div key={index} className="section">
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Summary;
*/



import React, { useEffect, useState } from 'react';
import './Summary.css';

function Summary() {
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    fetch('/generative_ai_summary.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setSummaryData(data))
      .catch(error => console.error('Error loading summary:', error));
  }, []);

  const handleReadMore = () => {
    window.open('https://hatchworks.com/blog/gen-ai/generative-ai-use-cases/', '_blank', 'noopener noreferrer');
  };

  if (!summaryData) return <div className="loading">Loading...</div>;

  return (
    <div className="reports-container">
      <div className="reports-content">
        <h1 className="main-title">{summaryData.title}</h1>
        <div className="report-sections">
          {summaryData.sections.map((section, index) => (
            <div key={index} className="section-card">
              <h3 className="section-title">{section.title}</h3>
              <p className="section-content">{section.content}</p>
            </div>
          ))}
        </div>
        <button 
          className="read-more-btn"
          onClick={handleReadMore}
        >
          Read Full Article
        </button>
      </div>
    </div>
  );
}

export default Summary;
