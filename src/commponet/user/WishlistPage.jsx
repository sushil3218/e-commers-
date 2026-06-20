import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WishlistPage({ wishlist, setWishlist, cart, setCart, setPage }) {
  const [items, setItems] = useState(Object.values(wishlist || {}));
  const [confirmItem, setConfirmItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load wishlist from server on mount
  useEffect(() => {
    let cancelled = false;
    const loadWishlist = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://192.168.29.2:7210/api/v1/wishlist/my-wishlist");  
        // Normalize: API might return array of objects or array of product objects
        const data = Array.isArray(res.data) ? res.data : [];
        // If items are just ids, you may need to fetch product details separately.
        // Here assume each item contains product info (id, title, price, image, etc.)
        if (!cancelled) {
          setItems(data);
          if (typeof setWishlist === "function") {
            const obj = {};
            data.forEach((it) => {
              // If API returns productId property, use that key, else fallback to id
              const key = String(it.productId || it.id);
              obj[key] = it;
            });
            setWishlist(obj);
          }
        }
      } catch (err) {
        console.error("Error loading wishlist:", err);
        // fallback to localStorage
        try {
          const stored = localStorage.getItem("wishlist");
          if (stored && !cancelled) {
            const parsed = JSON.parse(stored);
            const arr = Object.values(parsed);
            setItems(arr);
            if (typeof setWishlist === "function") setWishlist(parsed);
          }
        } catch (e) {
          console.error("Local wishlist read failed", e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadWishlist();
    return () => {
      cancelled = true;
    };
  }, [setWishlist]);

  // keep local items when prop wishlist changes
  useEffect(() => {
    setItems(Object.values(wishlist || {}));
  }, [wishlist]);

  // Add to cart (uses parent setCart)
  const addToCart = async (product) => {
    try {
      // optimistic UI: update local cart
      setCart((prev) => {
        const newCart = { ...(prev || {}) };
        if (newCart[product.id]) {
          newCart[product.id].quantity = (Number(newCart[product.id].quantity) || 0) + 1;
        } else {
          newCart[product.id] = { ...product, quantity: 1 };
        }
        return newCart;
      });

      // call backend to add to cart (if exists)
      await axios.post("http://192.168.29.2:7210/api/v1/cart/add-to-cart", {
        productId: product.id,
        quantity: 1,
      });
    } catch (err) {
      console.error("Error adding wishlist item to cart:", err);
      setError("Failed to add to cart. Please try again.");
    }
  };

  // Remove from wishlist (with confirmation)
  const handleRemoveConfirm = async (id) => {
    // remove locally first
    const updated = { ...(wishlist || {}) };
    delete updated[id];
    setWishlist(updated);
    setConfirmItem(null);

    try {
      await axios.delete(`http://192.168.29.2:7210/api/v1/wishlist/remove/${id}`);
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setError("Failed to remove from wishlist. Please try again.");
      // revert local state if needed (optional)
    }
  };

  // Toggle wishlist item (used by other components)
  const toggleWishlistBackend = async (productId, add, product) => {
    try {
      if (add) {
        await axios.post("http://192.168.29.2:7210/api/v1/wishlist/add-to-wishlist", {
          productId,
        });
        setWishlist((prev) => ({ ...(prev || {}), [String(productId)]: product }));
      } else {
        await axios.delete(`http://192.168.29.2:7210/api/v1/wishlist/remove/${productId}`);
        setWishlist((prev) => {
          const copy = { ...(prev || {}) };
          delete copy[String(productId)];
          return copy;
        });
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      setError("Failed to update wishlist. Please try again.");
    }
  };

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", padding: "20px" }}>
      <div style={{ background: "#fff", padding: "15px 20px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>My Wishlist</h2>
        <div style={{ fontSize: 14 }}>
          <span style={{ marginRight: 5 }}>
            <i className="bi bi-house-door-fill"></i>
          </span>
          <a href="#" style={{ color: "#007bff", textDecoration: "none" }} onClick={(e) => { e.preventDefault(); setPage("home"); }}>
            Home
          </a>{" "}
          &gt; My Wishlist
        </div>
      </div>

      {loading && <p>Loading wishlist...</p>}
      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
        {items.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          items.map((item) => {
            // If API returned item wrapper, normalize to product fields
            const product = item.product || item;
            const idKey = String(product.productId || product.id);
            return (
              <div key={idKey} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: "15px", position: "relative", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                <button onClick={() => setConfirmItem(product)} style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer" }}>
                  <i className="bi bi-heart-fill" style={{ fontSize: 22, color: "red" }}></i>
                </button>

                <img src={product.image} alt={product.title} style={{ width: "100%", height: 160, objectFit: "contain", marginBottom: 12 }} />

                <h4 style={{ fontSize: 13, fontWeight: 500, color: "#333", marginBottom: 8, minHeight: "40px" }}>{product.title}</h4>
                <p style={{ color: "#007bff", fontWeight: "bold", marginBottom: 12 }}>${(product.price || 0).toFixed(2)}</p>

                <button onClick={() => addToCart(product)} style={{ width: "100%", background: "#fca34d", border: "none", padding: "10px 0", borderRadius: 6, color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
                  <i className="bi bi-cart3" style={{ marginRight: 6 }}></i>
                  Add to Cart
                </button>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: 40, textAlign: "center" }}>
        <button onClick={() => setPage("home")} style={{ padding: "12px 24px", background: "#d6d3d3", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
          ← Return To Shopping
        </button>
      </div>

      {confirmItem && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: 8, width: 320, textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
            <h4>Remove Item?</h4>
            <p>Do you want to remove <b>{confirmItem.title}</b> from your wishlist?</p>
            <div style={{ marginTop: 15, display: "flex", gap: 10, justifyContent: "center" }}>
              <button style={{ padding: "8px 16px", background: "red", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }} onClick={() => handleRemoveConfirm(String(confirmItem.id || confirmItem.productId))}>
                Yes
              </button>
              <button style={{ padding: "8px 16px", background: "#ddd", border: "none", borderRadius: 4, cursor: "pointer" }} onClick={() => setConfirmItem(null)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
