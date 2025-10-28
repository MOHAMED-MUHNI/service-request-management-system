import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo">
            <img src="/logoMain.png" alt="ServicePro Logo" className="logo-icon" />
            <span className="logo-text">ServicePro</span>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>

          <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#home" onClick={closeMobileMenu}>Home</a>
            <a href="#services" onClick={closeMobileMenu}>Services</a>
            <a href="#about" onClick={closeMobileMenu}>About</a>
            <a href="#contact" onClick={closeMobileMenu}>Contact</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/track'); closeMobileMenu(); }}>Track Request</a>
            <button className="nav-button" onClick={() => { navigate('/admin/login'); closeMobileMenu(); }}>
              Admin Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Professional Service
            <span className="highlight"> Request Management</span>
          </h1>
          <p className="hero-subtitle">
            Seamless logistics, reliable service, and real-time tracking at your fingertips
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/customer')}>
              Request Service
              <span className="btn-icon">→</span>
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/login')}>
              Admin Portal
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <h3>500+</h3>
              <p>Services Delivered</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Professional Drivers</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" id="services">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Complete logistics solutions for every need</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <img 
                src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=400&fit=crop" 
                alt="Package Delivery" 
                className="service-image"
              />
              <div className="service-content">
                <h3>Package Delivery</h3>
                <p>Fast and secure package delivery services with real-time tracking</p>
                <button className="learn-more" onClick={() => navigate('/customer')}>
                  Book Now →
                </button>
              </div>
            </div>
            <div className="service-card">
              <img 
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop" 
                alt="Furniture Moving" 
                className="service-image"
              />
              <div className="service-content">
                <h3>Furniture Moving</h3>
                <p>Professional furniture relocation with care and precision</p>
                <button className="learn-more" onClick={() => navigate('/customer')}>
                  Book Now →
                </button>
              </div>
            </div>
            <div className="service-card">
              <img 
                src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&h=400&fit=crop" 
                alt="Document Courier" 
                className="service-image"
              />
              <div className="service-content">
                <h3>Document Courier</h3>
                <p>Urgent document delivery with guaranteed on-time arrival</p>
                <button className="learn-more" onClick={() => navigate('/customer')}>
                  Book Now →
                </button>
              </div>
            </div>
            <div className="service-card">
              <img 
                src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&h=400&fit=crop" 
                alt="Grocery Delivery" 
                className="service-image"
              />
              <div className="service-content">
                <h3>Grocery Delivery</h3>
                <p>Fresh groceries delivered to your doorstep quickly</p>
                <button className="learn-more" onClick={() => navigate('/customer')}>
                  Book Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-content">
            <div className="features-text">
              <h2>Why Choose ServicePro?</h2>
              <p className="features-intro">
                We combine cutting-edge technology with exceptional service to deliver 
                an unmatched customer experience.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div>
                    <h4>Real-Time Tracking</h4>
                    <p>Monitor your service request status in real-time</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div>
                    <h4>Professional Team</h4>
                    <p>Experienced and verified drivers and staff</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div>
                    <h4>24/7 Support</h4>
                    <p>Round-the-clock customer support team</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div>
                    <h4>Flexible Scheduling</h4>
                    <p>Choose your preferred date and time</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="features-image">
              <div className="image-placeholder"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section" id="about">
        <div className="container">
          <div className="section-header">
            <h2>Our Professional Team</h2>
            <p>Meet the experts behind our success</p>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <img 
                src="/member1.png" 
                alt="Muhni - Fleet Manager" 
                className="team-image"
              />
              <div className="team-info">
                <h4>Muhni</h4>
                <p>Fleet Manager</p>
              </div>
            </div>
            <div className="team-card">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop" 
                alt="Team Member" 
                className="team-image"
              />
              <div className="team-info">
                <h4>Sarah Williams</h4>
                <p>Operations Director</p>
              </div>
            </div>
            <div className="team-card">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop" 
                alt="Team Member" 
                className="team-image"
              />
              <div className="team-info">
                <h4>Michael Chen</h4>
                <p>Logistics Coordinator</p>
              </div>
            </div>
            <div className="team-card">
              <img 
                src="/member2.png" 
                alt="Team Member" 
                className="team-image"
              />
              <div className="team-info">
                <h4>Emily Rodriguez</h4>
                <p>Customer Success Lead</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="contact">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Submit your service request now and experience the difference</p>
            <button className="btn btn-large btn-primary" onClick={() => navigate('/customer')}>
              Request Service Now
              <span className="btn-icon">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-col">
              <h4>
                <img src="/logoMain.png" alt="ServicePro" style={{width: '50px', height: '50px', objectFit: 'contain', marginRight: '10px', verticalAlign: 'middle'}} />
                ServicePro
              </h4>
              <p>Professional service request and fleet management solution for modern businesses.</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                <li><a href="#services">Package Delivery</a></li>
                <li><a href="#services">Furniture Moving</a></li>
                <li><a href="#services">Document Courier</a></li>
                <li><a href="#services">Grocery Delivery</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact Info</h4>
              <ul>
                <li>📧 info@servicepro.com</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>📍 123 Business Street</li>
                <li>🕐 24/7 Available</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 ServicePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
