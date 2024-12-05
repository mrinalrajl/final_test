import React from 'react';
import './SlideNotify.css';  // Import the CSS file

const SlideNotify = ({ message, onClose }) => {
  return (
    <div className={`slide-notify ${message ? 'show' : ''}`}>
      <p>{message}</p>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default SlideNotify;