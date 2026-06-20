import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CartPage({ cart, setPage, setCart, onAdd, onRemove }) {
  const [items, setItems] = useState(Object.values(cart || {}));
  const [error, setError] = useState("");
  const [confirmItem, setConfirmItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load server cart on mount
  useEffect(() => {
    let cancelled = false;
    const loadCart = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://192.168.29.2:7210/api/v1/cart/my-cart");
        // Expecting server returns array of cart items or object. Normalize to array.
        const data = Array.isArray(res.data) ? res.data : Object.values(res.data || {});
        if (!cancelled) {
          setItems(data);
          // also sync parent setCart if provided (normalize to object keyed by id)
          if (typeof setCart === "function") {
            const obj = {};
            data.forEach((it) => {
              obj[String(it.id)] = it;
            });
            setCart(obj);
          }
        }
      } catch (err) {
        console.error("Error loading cart from server:", err);
        // fallback to localStorage if available
        try {
          const stored = localStorage.getItem("cart");
          if (stored && !cancelled) {
            const parsed = JSON.parse(stored);
            setItems(Object.values(parsed));
            if (typeof setCart === "function") setCart(parsed);
          }
        } catch (e) {
          console.error("Local cart read failed", e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCart();
    return () => {
      cancelled = true;
    };
  }, [setCart]);

  // Save cart locally + sync parent state whenever items change
  useEffect(() => {
    const obj = {};
    items.forEach((item) => {
      obj[String(item.id)] = item;
    });
    try {
      localStorage.setItem("cart", JSON.stringify(obj));
    } catch (e) {
      /* ignore localStorage errors */
    }
    if (typeof setCart === "function") setCart(obj);
  }, [items, setCart]);

  // Always scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Increment qty (local + call API)
  const incrementQty = async (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: (item.quantity || 0) + 1 } : item))
    );

    // optimistic update then backend
    try {
      await axios.post("http://192.168.29.2:7210/api/v1/cart/add-to-cart", {
        productId: id,
        quantity: 1, // backend may interpret as increment
      });
      // call parent onAdd if provided
      if (typeof onAdd === "function") {
        const product = items.find((it) => it.id === id) || { id };
        onAdd(product, (product.quantity || 0) + 1);
      }
    } catch (err) {
      console.error("Error incrementing qty:", err);
      setError("Failed to update cart. Please try again.");
    }
  };

  // Decrement qty (local + call API)
  const decrementQty = async (id) => {
    const current = items.find((it) => it.id === id);
    if (!current) return;

    if (current.quantity > 1) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
      );
      try {
        // call backend to reduce by 1
        await axios.post("http://192.168.29.2:7210/api/v1/cart/add-to-cart", {
          productId: id,
          quantity: -1, // if your backend supports negative to decrement; if not, change API
        });
        if (typeof onRemove === "function") onRemove(id, false);
      } catch (err) {
        console.error("Error decrementing qty:", err);
        setError("Failed to update cart. Please try again.");
      }
    } else {
      // quantity === 1 -> remove item
      setConfirmItem(current);
    }
  };

  // Manual change from input
  const handleQtyChange = async (id, value) => {
    const qty = value === "" ? 0 : Math.max(0, Number(value) || 0);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));

    try {
      // Replace quantity via backend (if backend supports set)
      await axios.post("http://192.168.29.2:7210/api/v1/cart/add-to-cart", {
        productId: id,
        quantity: qty,
      });
      // keep parent state in sync
      const product = items.find((it) => it.id === id) || { id };
      if (typeof onAdd === "function") onAdd(product, qty);
    } catch (err) {
      console.error("Error setting qty:", err);
      setError("Failed to set quantity. Please try again.");
    }
  };

  // Confirm remove (user pressed Yes)
  const handleRemoveConfirm = async (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setConfirmItem(null);
    try {
      await axios.delete(`http://192.168.29.2:7210/api/v1/cart/remove/${id}`, {
        data: { removeAll: true },
      });
      if (typeof onRemove === "function") onRemove(id, true);
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setError("Failed to remove item. Please try again.");
    }
  };

  // Compute subtotal (only qty > 0)
  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity > 0 ? item.price * item.quantity : 0),
    0
  );

  const hasInvalidItems = items.some((item) => item.quantity === 0);

  const handleCheckout = () => {
    if (hasInvalidItems) {
      setError("⚠ Some products have 0 quantity. Please update or remove them before checkout.");
      return;
    }
    setError("");
    alert("Proceeding to checkout...");
    // optionally call backend checkout endpoint here 
  };

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", padding: "20px" }}>
      <div
        style={{
          background: "#fff",
          padding: "15px 20px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>My Cart</h2>
        <div style={{ fontSize: 14 }}>
          <span style={{ marginRight: 5 }}>
            <i className="bi bi-house-door-fill"></i>
          </span>
          <a
            href="#"
            style={{ color: "#007bff", textDecoration: "none" }}
            onClick={(e) => {
              e.preventDefault();
              setPage("home");
            }}
          >
            Home
          </a>{" "}
          &gt; My Cart
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1, background: "#fff", padding: "20px" }}>
          {loading && <p>Loading cart...</p>}
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                padding: "15px 0",
                background: item.quantity === 0 ? "#ffe6e6" : "transparent",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{ width: 70, height: 70, objectFit: "contain", marginRight: 20 }}
              />
              <div style={{ flex: 3 }}>
                <div>{item.title}</div>
                <div style={{ color: "#555", fontSize: 14, fontWeight: "bold" }}>
                  Price Per Piece ${item.price.toFixed(2)}
                </div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <label style={{ fontSize: 13 }}>Qty</label>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: 5 }}>
                  <button
                    onClick={() => decrementQty(item.id)}
                    style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: "#d6d3d3", cursor: "pointer", fontWeight: "bold" }}
                    disabled={item.quantity <= 0}
                  >
                    −
                  </button>

                  <input
                    type="number"
                    value={item.quantity === 0 ? "" : item.quantity}
                    min="0"
                    onChange={(e) => handleQtyChange(item.id, e.target.value)}
                    style={{ width: 50, textAlign: "center", border: "1px solid #ccc", borderRadius: 4 }}
                  />

                  <button
                    onClick={() => incrementQty(item.id)}
                    style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: "#d6d3d3", cursor: "pointer", fontWeight: "bold" }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>
                {item.quantity > 0 ? `$${(item.price * item.quantity).toFixed(2)}` : "—"}
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <button
                  onClick={() => setConfirmItem(item)}
                  style={{ color: "red", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && !loading && <p>Your cart is empty.</p>}
        </div>

        <div style={{ width: 320, background: "#fff", padding: 20, borderRadius: 5 }}>
          <h3>Cart Total</h3>
          <hr />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ fontWeight: "bold", fontSize: 20, color: "#0f97ba", marginBottom: 20, display: "flex", justifyContent: "space-between" }}>
            <span>Total Amount</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {error && <div style={{ color: "red", marginBottom: 10, fontWeight: "bold" }}>{error}</div>}

          <button
            onClick={handleCheckout}
            disabled={hasInvalidItems}
            style={{
              width: "100%",
              padding: "12px 0",
              background: hasInvalidItems ? "#ccc" : "#fca34d",
              border: "none",
              borderRadius: 4,
              color: hasInvalidItems ? "#666" : "#fff",
              cursor: hasInvalidItems ? "not-allowed" : "pointer",
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
            Continue To Checkout
          </button>

          <button onClick={() => setPage("home")} style={{ width: "100%", padding: "12px 0", background: "#d6d3d3", border: "none", borderRadius: 4, cursor: "pointer" }}>
            ← Return To Shopping
          </button>
        </div>
      </div>

      {confirmItem && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: 8, width: 320, textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
            <h4>Remove Item?</h4>
            <p>Do you want to remove <b>{confirmItem.title}</b> from your cart?</p>
            <div style={{ marginTop: 15, display: "flex", gap: 10, justifyContent: "center" }}>
              <button style={{ padding: "8px 16px", background: "red", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }} onClick={() => handleRemoveConfirm(confirmItem.id)}>
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
