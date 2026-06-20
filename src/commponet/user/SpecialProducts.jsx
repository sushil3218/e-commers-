import React, { useEffect, useState } from "react";
import "./SpecialProducts.css";
import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";

const ProductCard = ({
  product,
  quantity,
  favorite,
  onAdd,
  onFavoriteToggle,
  showMessage,
  confirmRemove,
  onSelectProduct, // ✅ add
}) => (
  <div className="product-card">
    {/* Wishlist / Favorite */}
    <div
      className="favorite-icon"
      onClick={() => onFavoriteToggle(product.id, !favorite, product)}
    >
      {favorite ? <FaHeart color="red" /> : <FaRegHeart />}
    </div>

    {/* Product Image (click to open detail) */}
    <img
      src={product.image}
      alt={product.title}
      className="product-image"
      onClick={() => onSelectProduct(product)} // ✅ open detail
      style={{ cursor: "pointer" }}
    />

    {/* Title & Price (title clickable too) */}
    <div
      className="product-title"
      onClick={() => onSelectProduct(product)}
      style={{ cursor: "pointer" }}
    >
      {product.title}
    </div>
    <div className="product-price">From ${product.price}</div>

    {/* ✅ Action Area */}
    <div className="action-area">
      {quantity === 0 ? (
        <button
          className="add-to-cart"
          onClick={() => {
            onAdd(product, 1);
            showMessage(`✔ "${product.title}" added to cart.`);
          }}
        >
          <i className="bi bi-lightning-fill"></i> ADD TO CART
        </button>
      ) : (
        <div className="qty-control">
          <button
            className="qty-btn"
            onClick={() =>
              quantity > 1
                ? onAdd(product, quantity - 1)
                : confirmRemove(product)
            }
          >
            {quantity > 1 ? "−" : <FaTrash size={14} color="white" />}
          </button>
          <span>{quantity}</span>
          <button
            className="qty-btn"
            onClick={() => {
              onAdd(product, quantity + 1);
            }}
          >
            +
          </button>
        </div>
      )}

      <div className="added-box">{quantity > 0 ? "✔ Added To Cart" : ""}</div>
    </div>
  </div>
);

const SpecialProducts = ({
  cart,
  wishlist,
  onAdd,
  onRemove,
  onFavoriteToggle,
  onSelectProduct, // ✅ add
}) => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [confirmModal, setConfirmModal] = useState(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products ")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.slice(0, 9));
      })
      .catch((err) => console.error("API error:", err));
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const confirmRemove = (product) => {
    setConfirmModal(product);
  };

  const handleRemoveConfirmed = () => {
    if (confirmModal) {
      onRemove(confirmModal.id);
      showMessage(`❌ "${confirmModal.title}" removed from cart.`);
      setConfirmModal(null);
    }
  };

  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5);

  return (
    <div className="special-products">
      {message && <div className="added-message">{message}</div>}

      {confirmModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Remove Product Confirmation</h3>
            <p>
              Are you sure you want to remove{" "}
              <strong>{confirmModal.title}</strong> from your cart?
            </p>
            <div className="modal-actions">
              <button className="btn-yes" onClick={handleRemoveConfirmed}>
                Yes
              </button>
              <button className="btn-no" onClick={() => setConfirmModal(null)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {[firstRow, secondRow].map((rowProducts, idx) => (
        <div key={idx} className="special-box">
          <h2>Special Products For You</h2>
          <p className="subtitle">Special Products Just For You</p>
          <div
            className={`products-row ${idx === 0 ? "first-row" : "second-row"}`}
          >
            {rowProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={cart[product.id]?.quantity || 0}
                favorite={wishlist[product.id] ? true : false}
                onAdd={onAdd}
                onRemove={onRemove}
                onFavoriteToggle={onFavoriteToggle}
                showMessage={showMessage}
                confirmRemove={confirmRemove}
                onSelectProduct={onSelectProduct} // ✅ pass down
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpecialProducts;
