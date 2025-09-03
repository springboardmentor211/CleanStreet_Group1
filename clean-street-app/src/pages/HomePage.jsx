
import React from "react";
import "../styles/homePage.css";

const HomePage = () => {
  return (
    <div className="homepage-container">
  {/* ...no navbar here, it is rendered by AppLayout... */}

      {/* Hero Section */}
      <section className="homepage-hero">
        <h1>CleanStreet</h1>
        <p>Empowering communities to report and resolve civic issues together. Make</p>
        <div className="hero-buttons">
          <button className="get-started-btn">Get Started</button>
          <button className="browse-issues-btn">Browse Issues</button>
        </div>
      </section>

      {/* How it works */}
      <section className="homepage-how-it-works">
        <h2>How CleanStreet Works</h2>
        <p>Our platform makes it easy for citizens to report issues and for communities to work together on solutions .</p>
        <div className="how-it-works-cards">
          <div className="how-card">
            <div className="how-icon how-icon-1"></div>
            <h3>Report Issues</h3>
            <p>Easily report potholes, broken streetlights, graffiti, and other civic issues in your community .</p>
          </div>
          <div className="how-card">
            <div className="how-icon how-icon-2"></div>
            <h3>Track Location</h3>
            <p>GPS integration helps pinpoint exact locations and creates a visual map of community issues .</p>
          </div>
          <div className="how-card">
            <div className="how-icon how-icon-3"></div>
            <h3>Community Voice</h3>
            <p>Citizens can vote on issues, add comments, and collaborate to bring attention to important problems .</p>
          </div>
          <div className="how-card">
            <div className="how-icon how-icon-4"></div>
            <h3>Get Results</h3>
            <p>Track the progress of reported issues and see real improvements in your neighborhood .</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="homepage-cta">
        <h2>Ready to Make a Difference ?</h2>
        <p>Join thousands of citizens working together to improve their communities .</p>
        <button className="cta-btn">Create Your Account</button>
      </section>
    </div>
  );
};

export default HomePage;
