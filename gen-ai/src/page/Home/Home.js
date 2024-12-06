import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="hero">
        <h1>Exploring Generative AI</h1>
        <p>Unleashing creativity and innovation through artificial intelligence</p>
      </header>

      <section className="intro">
        <h2>What is Generative AI?</h2>
        <p>
          Generative AI refers to artificial intelligence systems that can create new content, 
          including text, images, music, and more. These systems learn patterns from existing 
          data to generate novel and creative outputs.
        </p>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Text Generation</h3>
          <p>Create human-like text for various applications, from creative writing to code generation.</p>
        </div>
        <div className="feature-card">
          <h3>Image Creation</h3>
          <p>Generate unique images from textual descriptions, opening new realms of visual creativity.</p>
        </div>
        <div className="feature-card">
          <h3>Music Composition</h3>
          <p>Compose original music pieces across different genres and styles.</p>
        </div>
      </section>

      <section className="applications">
        <ul>
          <li>Content Creation</li>
          <li>Product Design</li>
          <li>Scientific Research</li>
          <li>Entertainment</li>
          <li>Education</li>
        </ul>
      </section>

      <section className="cta">
        <h2>Ready to Explore?</h2>
        <p>Dive into the world of Generative AI and discover its potential.</p>
      </section>
    </div>
  );
}

export default Home;