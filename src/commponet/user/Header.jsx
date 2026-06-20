import { useState, useEffect, useRef } from "react";
import "./Header.css";

export default function Header({ cartCount, wishlistCount, setPage, setSelectedProduct }) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const dropdownRef = useRef(null);

  // ✅ Load username from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUsername("");
    setOpen(false);
    setPage("login");
  };

  // ✅ Handle search request
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch("http://192.168.29.2:7210/api/v1/product/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchQuery }),
      });

      const data = await response.json();
      if (data.status && data.data) {
        setResults(data.data);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }
  };

  // ✅ Open product detail page
  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setResults([]);
    setPage("productDetail");
  };

  return (
    <header className="header">
      {/* Logo */}
      <img src="/logo.png" alt="Logo" className="logo" onClick={() => setPage("home")} />

      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for Products, Brands and More"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">
          <i className="bi bi-search"></i>
        </button>

        {results.length > 0 && (
          <div className="search-results">
            {results.map((product) => (
              <div
                key={product._id}
                className="search-item"
                onClick={() => openProductDetail(product)}
              >
                <img src={product.image || "/placeholder.png"} alt={product.name} />
                <span>{product.name}</span>
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Right Menu */}
      <div className="header-menu">
        {/* Account Dropdown */}
        <div className="menu-item account" ref={dropdownRef}>
          <i className="bi bi-person-circle account-icon" onClick={() => setOpen(!open)}></i>
          <span className="account-text" onClick={() => setOpen(!open)}>Account</span>

          {open && (
            <div className="account-dropdown">
              <h4>Hello {username || "User"}</h4>
              <p>{username ? "Welcome back!" : "To access your account"}</p>

              {!username ? (
                <>
                  <button className="btn-login" onClick={() => { setPage("login"); setOpen(false); }}>Login</button>
                  <button className="btn-signup" onClick={() => { setPage("signup"); setOpen(false); }}>Sign Up</button>
                </>
              ) : (
                <button className="btn-signup" onClick={handleLogout}>Logout</button>
              )}

              <hr />

              {/* ✅ Shop → Admin Login (new tab) */}
              <div
                className="dropdown-item"
                onClick={() => {
                  window.open("/?page=admin-login", "_blank"); // opens AdminLogin.jsx route
                  setOpen(false);
                }}
              >
                <i className="bi bi-shop"></i> Shop
              </div>

              {/* ✅ Orders Page */}
              <div
                className="dropdown-item"
                onClick={() => {
                  setPage("orders");
                  setOpen(false);
                }}
              >
                <i className="bi bi-bag"></i> My Orders
              </div>

              {/* ✅ Delete Account */}
              <div className="dropdown-item danger">
                <i className="bi bi-trash"></i> Delete Account
              </div>
            </div>
          )}
        </div>

        {/* Wishlist */}
        <div className="menu-item badge" data-tooltip="Wishlist" onClick={() => setPage("wishlist")}>
          <i className="bi bi-heart wishlist-icon" style={{ color: wishlistCount > 0 ? "red" : "black" }}></i>
          <div className="count">{wishlistCount}</div>
        </div>

        {/* Cart */}
        <div className="menu-item badge" data-tooltip="Cart" onClick={() => setPage("cart")}>
          <i className="bi bi-cart3 cart-icon"></i>
          <div className="count">{cartCount}</div>
        </div>
      </div>
    </header>
  );
}
