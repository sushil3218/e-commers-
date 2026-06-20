import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Logo + Info */}
        <div className="footer-section">
          <img
            src="/public/logo.png"
            alt="Logo"
            className="footer-logo"
          />
          <p>69 Selous Ave, Harare, Zimbabwe</p>
          <p>Support(+263) 03 0000052</p>
          <p>info@demo.com</p>
        </div>

        {/* Help Center */}
        <div className="footer-section">
          <h4>Help Center</h4>
          <ul>
            <li>FAQ</li>
            <li>About E-Commerce</li>
            <li>Support Tickets</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>Become A Supplier</li>
            <li>Track Order</li>
            <li>Services & Membership</li>
            <li>Help & Community</li>
          </ul>
        </div>

        {/* Buy On E-Commerce */}
        <div className="footer-section">
          <h4>Buy On E-Commerce</h4>
          <ul>
            <li>Terms & Conditions</li>
            <li>Privacy & Rules</li>
          </ul>
        </div>

        {/* Download App */}
        <div className="footer-section">
          <h4>Download App</h4>
          <div className="app-buttons">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
              />
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>©2021 E-Commerce All Rights Reserved</p>
        <div className="social-icons">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
          <a href="#">Pinterest</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
