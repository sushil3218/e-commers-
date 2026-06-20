import { useState, useEffect } from "react";
import Banner from "./commponet/user/Banner";
import Footer from "./commponet/user/Footer";
import Header from "./commponet/user/Header";
import SpecialProducts from "./commponet/user/SpecialProducts";
import CartPage from "./commponet/user/CartPage";
import WishlistPage from "./commponet/user/WishlistPage";
import Newsletter from "./commponet/user/Newsletter";
import Login from "./commponet/user/Login";
import Signup from "./commponet/user/Signup";
import ProductDetail from "./commponet/user/ProductDetail";

// ✅ Admin Pages
import AdminLogin from "./commponet/AdminShop/AdminLogin";
import AdminSignup from "./commponet/AdminShop/AdminSignup";
import AdminDashboard from "./commponet/AdminShop/AdminDashboard";

import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [cart, setCart] = useState({});
  const [wishlist, setWishlist] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  const [page, setPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("page") || "home";
  });

  // ✅ Define which pages are user vs admin
  const userPages = ["home", "product", "cart", "wishlist", "login", "signup"];
  const adminPages = ["admin-login", "admin-signup", "admin-dashboard"];

  // 🔹 Helper: safely get local data
  const getLocalData = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || {};
    } catch {
      return {};
    }
  };

  useEffect(() => {
    setCart(getLocalData("cart"));
    setWishlist(getLocalData("wishlist"));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const handleStorage = () => {
      setUsername(localStorage.getItem("username") || "");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleAdd = (product, qty = null) => {
    if (!product || product.id === undefined || product.id === null) return;
    const id = String(product.id);
    setCart((prev) => {
      const newCart = { ...prev };
      if (qty === null) {
        if (newCart[id]) {
          newCart[id].quantity = (Number(newCart[id].quantity) || 0) + 1;
        } else {
          newCart[id] = { ...product, quantity: 1 };
        }
      } else {
        newCart[id] = { ...product, quantity: Number(qty) };
      }
      return newCart;
    });
  };

  const handleRemove = (productId, removeAll = false) => {
    if (productId === undefined || productId === null) return;
    const id = String(productId);
    setCart((prev) => {
      const newCart = { ...prev };
      if (!newCart[id]) return newCart;
      if (removeAll) {
        delete newCart[id];
      } else if ((Number(newCart[id].quantity) || 0) > 1) {
        newCart[id].quantity = Number(newCart[id].quantity) - 1;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const handleFavoriteToggle = (productId, fav, product) => {
    const id = String(productId);
    setWishlist((prev) => {
      const newWishlist = { ...prev };
      if (fav) {
        newWishlist[id] = product;
      } else {
        delete newWishlist[id];
      }
      return newWishlist;
    });
  };

  return (
    <div className="w-full">
      {/* ✅ Render User Header/Footer ONLY for user pages */}
      {userPages.includes(page) && (
        <Header
          cartCount={Object.keys(cart).length}
          wishlistCount={Object.keys(wishlist).length}
          setPage={setPage}
          username={username}
          setSelectedProduct={setSelectedProduct}
        />
      )}

      {/* ✅ Main User Pages */}
      {page === "home" && (
        <>
          <Banner />
          <SpecialProducts
            cart={cart}
            wishlist={wishlist}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onFavoriteToggle={handleFavoriteToggle}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setPage("product");
            }}
          />
          <Newsletter />
        </>
      )}

      {page === "product" && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          cart={cart}
          wishlist={wishlist}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onFavoriteToggle={handleFavoriteToggle}
          setPage={setPage}
          setSelectedProduct={setSelectedProduct}
        />
      )}

      {page === "cart" && (
        <CartPage
          cart={cart}
          setPage={setPage}
          setCart={setCart}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      )}

      {page === "wishlist" && (
        <WishlistPage
          wishlist={wishlist}
          setWishlist={setWishlist}
          cart={cart}
          setCart={setCart}
          setPage={setPage}
        />
      )}

      {page === "login" && <Login setPage={setPage} />}
      {page === "signup" && <Signup setPage={setPage} />}

      {/* ✅ Admin Pages (NO Header/Footer) */}
      {page === "admin-login" && <AdminLogin setPage={setPage} />}
      {page === "admin-signup" && <AdminSignup setPage={setPage} />}
      {page === "admin-dashboard" && <AdminDashboard setPage={setPage} />}

      {/* ✅ Render User Footer ONLY for user pages */}
      {userPages.includes(page) && <Footer />}
    </div>
  );
}

export default App;
