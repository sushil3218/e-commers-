import { useState } from "react";
import "./Auth.css";

export default function Signup({ setPage }) {
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
    countryCode: "",
    city: "",
    state: "",
    socialPlatform: "",
    socialId: "",
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
      const response = await fetch("http://192.168.29.2:7210/api/v1/user/create", {
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
          countryCode: "",
          city: "",
          state: "",
          socialPlatform: "",
          socialId: "",
        });

        // Redirect to login after short delay
        setTimeout(() => {
          setPage("login");
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
        <p className="auth-subtitle">Fill in your details to sign up.</p>

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
              <label>Country Code</label>
              <input type="text" name="countryCode" value={formData.countryCode} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="form-group half">
              <label>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Social Platform</label>
            <select name="socialPlatform" value={formData.socialPlatform} onChange={handleChange}>
              <option value="">Select Platform</option>
              <option value="email">Email</option>
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>

          <div className="form-group">
            <label>Social ID</label>
            <input type="text" name="socialId" value={formData.socialId} onChange={handleChange} />
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
          <span className="link" onClick={() => setPage("login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
