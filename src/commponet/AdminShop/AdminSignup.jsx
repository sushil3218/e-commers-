import { useState } from "react"
import "./admin.css";   // lowercase

export default function AdminSignup({ setPage }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    image: "",
    phone: "",
    gender: "",
    address: "",
    postalCode: "",
    country: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://192.168.29.2:7210/api/v1/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        setMessage("✅ Signup successful");

        // Save user info locally
        localStorage.setItem("username", formData.name);
        localStorage.setItem("token", data.token || "YOUR_FIXED_TOKEN_HERE");

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          dob: "",
          image: "",
          phone: "",
          gender: "",
          address: "",
          postalCode: "",
          country: "",
        });

        // Redirect to login
        setTimeout(() => {
          setPage("admin-login");
        }, 1000);
      } else {
        setMessage(data.message || "❌ Signup failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠ Something went wrong. Try again.");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <button
          className="auth-back-btn"
          onClick={() => setPage("home")}
        >
          <span style={{ fontSize: 18 }}>&larr;</span> Back
        </button>

        <h2>Create Account</h2>
        <p className="auth-subtitle">Fill in your details to creat shop</p>

        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Profile Image</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea name="address" rows="2" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Postal Code</label>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
            </div>
            <div className="form-group half">
              <label>Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn-signup full">Sign Up</button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <button className="btn-google">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Sign up with Google
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <span className="link" onClick={() => setPage("admin-login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
