import React from "react";
import "./adminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* Global Header */}
      <header className="global-header">
        <div className="left">
          <img src="/logo.png" alt="Logo" className="header-logo" />
          <h2>Dashboard</h2>
        </div>
        <div className="right">
          <i className="bi bi-bell"></i>
          <div className="user-dropdown">
            <i className="bi bi-person-circle"></i> Sushil
          </div>
        </div>
      </header>

      {/* Body (Sidebar + Main Content) */}
      <div className="body-section">
        {/* Sidebar */}
        <aside className="sidebar">
          {/* Profile Section */}
          <div className="profile-card">
            <div className="profile-bg">
              <img src="/cover-img.jpg" alt="Background" />
            </div>
            <div className="profile-info">
              <img src="/useradmin.jpg" alt="Profile" className="profile-img" />
              <h3>Sushil Hiwse</h3>
              <p>sushilhiwse18@gmail.com</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="menu">
            <a href="#" className="active">
              <i className="bi bi-house"></i> Dashboard
            </a>
            <a href="#">
              <i className="bi bi-person"></i> Profile
            </a>
            <a href="#">
              <i className="bi bi-cart"></i> Order Management
            </a>
            <a href="#">
              <i className="bi bi-box"></i> Product Management
            </a>
            <a href="#">
              <i className="bi bi-truck"></i> Delivery Dashboard
            </a>
            <a href="#">
              <i className="bi bi-headset"></i> Support Tickets
            </a>
            <a href="#">
              <i className="bi bi-envelope"></i> Inquiry Management
            </a>
            <a href="#" className="logout">
              <i className="bi bi-box-arrow-right"></i> Log Out
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <section className="dashboard-content">
            <h2>
              Hello, <span>Sushil Hiwse</span>
            </h2>

            {/* Welcome Box */}
            <div className="welcome-box">
              <div className="welcome-text">
                <h3>Welcome To Dashboard Admin Seller Dashboard!</h3>
                <p>
                  Your seller account is under review. Please allow our admin
                  team some time to complete the approval process.
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="status">Pending ⏳</span>
                </p>
                <p>
                  Once your account is approved, you will be notified via email.
                  In the meantime, feel free to browse our <b>Kulies.com</b> or
                  check back later.
                </p>
              </div>
              <div className="welcome-img">
                <img src="/dashboard.png" alt="welcome" />
              </div>
            </div>

            {/* Info Box */}
            <div className="info-box">
              <img src="/section-thankyou.png" alt="Explore" />
             
            </div>

            {/* Note */}
            <div className="note-box">
              <p>
                <b>Note:</b> If you have any questions, please contact us at{" "}
                <a href="mailto:support@ecommers.com">support@ecommers.com</a>
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
