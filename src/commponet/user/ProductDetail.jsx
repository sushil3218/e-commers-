import React, { useEffect, useState } from "react";
import "./ProductDetail.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

export default function ProductDetail({
  product,
  setPage,
  onAdd,
  onRemove,
  cart,
  wishlist,
  onFavoriteToggle,
  setSelectedProduct,
}) {
  const [details, setDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [trending, setTrending] = useState([]);
  const [tab, setTab] = useState("info");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [msgQty, setMsgQty] = useState("");
  const [msgType, setMsgType] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyError, setVerifyError] = useState(false);
  const [similarStart, setSimilarStart] = useState(0);

  const showCount = 5;
  const similarProducts = trending.slice(similarStart, similarStart + showCount);

  // ✅ Load reviews from localStorage
  useEffect(() => {
    if (!details?.id) return;
    const saved =
      JSON.parse(localStorage.getItem(`reviews-${details.id}`)) || [];
    setReviews(saved);
  }, [details?.id]);

  // ✅ Save reviews to localStorage
  useEffect(() => {
    if (!details?.id) return;
    localStorage.setItem(`reviews-${details.id}`, JSON.stringify(reviews));
  }, [reviews, details?.id]);

  const handleAddReview = () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please select a rating and write a comment.");
      return;
    }

    const newReview = {
      id: Date.now(),
      rating,
      comment,
      date: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      user: "Anonymous",
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment("");
  };

  // ✅ Fetch product + trending with axios
  useEffect(() => {
    let cancelled = false;

    async function fetchDetails() {
      if (!product?.id) return;
      try {
        const res = await axios.get(
          `https://fakestoreapi.com/products/${product.id}`
        );
        const data = res.data;
        if (!cancelled) {
          const withExtras = {
            ...data,
            wholesalePrices: data.wholesalePrices || [
              { range: "1-10", price: (data.price * 0.95).toFixed(2) },
              { range: "11-50", price: (data.price * 0.90).toFixed(2) },
              { range: "51+", price: (data.price * 0.85).toFixed(2) },
            ],
            stock: data.stock || "In Stock",
          };
          setDetails(withExtras);
          setImages([data.image, data.image, data.image]);
          setActiveIndex(0);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    }

    async function fetchTrending() {
      try {
        const res = await axios.get(
          "https://fakestoreapi.com/products?limit=8"
        );
        if (!cancelled) setTrending(res.data);
      } catch (err) {
        console.error("Error fetching trending:", err);
      }
    }

    fetchDetails();
    fetchTrending();

    return () => {
      cancelled = true;
    };
  }, [product]);

  // ✅ Auto image slide
  useEffect(() => {
    if (images.length > 1) {
      const id = setInterval(
        () => setActiveIndex((p) => (p + 1) % images.length),
        3000
      );
      return () => clearInterval(id);
    }
  }, [images]);

  if (!details) return <p>Loading...</p>;

  // ✅ Read qty
  const detailIdKey = String(details.id);
  const quantity = cart?.[detailIdKey]?.quantity || 0;

  // ✅ Backend Cart APIs
  const addToCartAPI = async (product, qty) => {
    try {
      await axios.post("http://192.168.29.2:7210/api/v1/cart/add-to-cart", {
        productId: product.id,
        quantity: qty,
      });
      onAdd(product, qty); // keep state in sync
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const removeFromCartAPI = async (productId, removeAll = false) => {
    try {
      await axios.delete(
        `http://192.168.29.2:7210/api/v1/cart/remove/${productId}`,
        { data: { removeAll } }
      );
      onRemove(productId, removeAll); // keep state in sync
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // ✅ Open product (for trending/similar)
  const openProduct = (item) => {
    if (typeof setSelectedProduct === "function") {
      setSelectedProduct(item);
      setPage("product");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="product-detail-page">
      {/* ===== Breadcrumb ===== */}
      <div className="breadcrumb-box">
        <div className="breadcrumb-row">
          <h3>Product Details</h3>
          <div className="breadcrumb-links">
            <i className="bi bi-house-door"></i>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPage("home");
              }}
            >
              Home
            </a>
            <span>› Product Details</span>
          </div>
        </div>
      </div>

      {/* ===== LEFT IMAGE SECTION ===== */}
      <div className="image-section">
        <div
          className="main-image-box"
          onMouseMove={(e) => {
            const { left, top, width, height } =
              e.currentTarget.getBoundingClientRect();
            const x = ((e.pageX - left) / width) * 100;
            const y = ((e.pageY - top) / height) * 100;
            document.documentElement.style.setProperty("--zoom-x", `${x}%`);
            document.documentElement.style.setProperty("--zoom-y", `${y}%`);
          }}
          onMouseEnter={() =>
            document.querySelector(".zoom-center-box").classList.add("active")
          }
          onMouseLeave={() =>
            document.querySelector(".zoom-center-box").classList.remove("active")
          }
        >
          <img
            src={images[activeIndex]}
            alt={details.title}
            className="main-image"
          />
        </div>

        <div
          className="zoom-center-box"
          style={{ backgroundImage: `url(${images[activeIndex]})` }}
        ></div>

        <div className="thumbnail-row">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="thumb"
              className={`thumbnail ${activeIndex === idx ? "active" : ""}`}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
        </div>
      </div>

      {/* ===== Product Detail Section ===== */}
      <div className="detail-section">
        <h2>{details.title}</h2>
        <p className="price">Price ${details.price}</p>

        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`bi ${
                i < Math.round(details.rating?.rate || 0)
                  ? "bi-star-fill text-warning"
                  : "bi-star"
              }`}
            />
          ))}
          <span> ({details.rating?.count || 0} Reviews)</span>
        </div>

        {/* Description */}
        <p className="desc">{details.description}</p>

        {/* Wholesale Price Section */}
        {details.wholesalePrices && (
          <div className="wholesale-box">
            <h4>Wholesale Price (Unit/Units):</h4>
            <ul>
              {details.wholesalePrices.map((w, i) => (
                <li key={i}>
                  Quantity {w.range} :{" "}
                  <span className="price">Price ${w.price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stock Info */}
        {details.stock && (
          <div className="stock-info">
            <span>⏱️ {details.stock}</span>
            <br />
            <button className="notify-btn">🔔 Notify Me</button>
          </div>
        )}

        {/* Cart & Wishlist */}
        <div className="actions">
          <div className="cart-btn">
            {quantity === 0 ? (
              <button
                className="special-add-btn"
                onClick={() => addToCartAPI(details, 1)}
              >
                <i className="bi bi-cart-plus"></i>
                Add to Cart
              </button>
            ) : (
              <div className="qty-inline">
                <button onClick={() => removeFromCartAPI(details.id, false)}>
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => addToCartAPI(details, quantity + 1)}>
                  +
                </button>
                <button onClick={() => removeFromCartAPI(details.id, true)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            )}
          </div>

          <button
            className={`wish-btn ${
              wishlist?.[String(details.id)] ? "active" : ""
            }`}
            onClick={() =>
              onFavoriteToggle(details.id, !wishlist?.[String(details.id)], details)
            }
          >
            <i
              className={`bi ${
                wishlist?.[String(details.id)] ? "bi-heart-fill" : "bi-heart"
              }`}
            ></i>
            {wishlist?.[String(details.id)]
              ? "Remove from Wishlist"
              : "Add To Wishlist"}
          </button>
        </div>
      </div>

      {/* ===== Extra Specifications ===== */}
      {product.specifications && (
        <div className="extra-box">
          <ul>
            {Object.values(product.specifications).map((spec, idx) => (
              <li key={idx}>{spec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ===== Right Sidebar ===== */}
      <div className="sidebar">
        <div className="recommend-box">
          <h4>Trending Products</h4>
          <div className="trending-list">
            {trending.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="trending-card"
                onClick={() => openProduct(item)}
              >
                <img src={item.image} alt={item.title} className="trend-img" />
                <div className="trend-info">
                  <p className="trend-title">{item.title.slice(0, 20)}...</p>
                  <p className="trend-price">From ${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Similar Products ===== */}
      <div className="similar-products">
        <h3>Similar Products</h3>
        <div className="similar-slider-controls">
          <button
            className="slider-btn"
            onClick={() => setSimilarStart(Math.max(0, similarStart - showCount))}
            disabled={similarStart === 0}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <div className="similar-grid">
            {similarProducts.map((item) => (
              <div
                key={item.id}
                className="similar-card"
                onClick={() => openProduct(item)}
              >
                <div className="img-box">
                  <img src={item.image} alt={item.title} />
                </div>
                <p className="similar-title">{item.title.slice(0, 30)}...</p>
                <p className="price">From ${item.price}</p>
              </div>
            ))}
          </div>
          <button
            className="slider-btn"
            onClick={() =>
              setSimilarStart(
                Math.min(trending.length - showCount, similarStart + showCount)
              )
            }
            disabled={similarStart + showCount >= trending.length}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* ===== Tabs & Send Message Row ===== */}
      <div className="tab-message-row">
        <div className="tab-box">
          <div className="tabs">
            <button
              className={tab === "info" ? "active" : ""}
              onClick={() => setTab("info")}
            >
              Additional Info
            </button>
            <button
              className={tab === "review" ? "active" : ""}
              onClick={() => setTab("review")}
            >
              Review
            </button>
          </div>

          {tab === "info" && (
            <table className="info-table">
              <tbody>
                <tr>
                  <td>Capacity</td>
                  <td>1.5 Liters</td>
                </tr>
                <tr>
                  <td>Color</td>
                  <td>Silver</td>
                </tr>
                <tr>
                  <td>Power</td>
                  <td>1500 Watts</td>
                </tr>
              </tbody>
            </table>
          )}

          {tab === "review" && (
            <div className="review-box amazon-style">
              {/* Title */}
              <h4>Customer Reviews</h4>

              {/* Average Rating */}
              <div className="review-summary">
                <div className="review-avg">
                  {reviews.length > 0
                    ? (
                        reviews.reduce((sum, r) => sum + r.rating, 0) /
                        reviews.length
                      ).toFixed(1)
                    : "0.0"}
                </div>
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bi ${
                        i <
                        Math.round(
                          reviews.length > 0
                            ? reviews.reduce((sum, r) => sum + r.rating, 0) /
                                reviews.length
                            : 0
                        )
                          ? "bi-star-fill text-warning"
                          : "bi-star"
                      }`}
                    />
                  ))}
                  <span className="review-count">
                    {reviews.length} global{" "}
                    {reviews.length === 1 ? "rating" : "ratings"}
                  </span>
                </div>
              </div>

              {/* Star Breakdown */}
              <div className="review-breakdown">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const percent = reviews.length
                    ? Math.round((count / reviews.length) * 100)
                    : 0;
                  return (
                    <div key={star} className="breakdown-row">
                      <span>{star} star</span>
                      <div className="breakdown-bar-bg">
                        <div
                          className="breakdown-bar"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span>{percent}%</span>
                    </div>
                  );
                })}
              </div>

              {/* --- Review Form --- */}
              <div className="review-form" style={{ margin: "18px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500 }}>
                    Your Rating:
                  </span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`bi ${
                        rating >= star ? "bi-star-fill text-warning" : "bi-star"
                      }`}
                      style={{ fontSize: 22, cursor: "pointer" }}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review..."
                  style={{
                    width: "100%",
                    minHeight: 40,
                    fontSize: 14,
                    marginBottom: 8,
                  }}
                />
                <button
                  style={{
                    fontSize: 14,
                    padding: "7px 18px",
                    borderRadius: 16,
                    background: "#ff6f00",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={handleAddReview}
                >
                  <i className="bi bi-send"></i> Submit Review
                </button>
              </div>

              {/* Review List */}
              <div className="review-list">
                {reviews.length === 0 ? (
                  <p>No reviews yet. Be the first!</p>
                ) : (
                  reviews.map((r, idx) => (
                    <div key={idx} className="review-card">
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi ${
                              i < r.rating
                                ? "bi-star-fill text-warning"
                                : "bi-star"
                            }`}
                          />
                        ))}
                        <span className="review-date">{r.date}</span>
                      </div>
                      <p className="review-comment">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* ===== Message Box ===== */}
        <div className="message-box">
          <h4>Send Your Message To This Supplier</h4>
          <p>
            To: <span style={{ color: "#00a2c7" }}>Raj Kumar</span>
          </p>
          <textarea
            placeholder="Enter details like product name, color, size, MOQ, etc."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input
            type="text"
            placeholder="Quantity"
            value={msgQty}
            onChange={(e) => setMsgQty(e.target.value)}
          />
          <select value={msgType} onChange={(e) => setMsgType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Sample">Sample</option>
            <option value="Bulk Order">Bulk Order</option>
          </select>
          <input
            type="text"
            placeholder="Enter Verification Code"
            value={verifyCode}
            onChange={(e) => {
              setVerifyCode(e.target.value);
              setVerifyError(false);
            }}
            style={{
              borderColor: verifyError ? "#ff4d4f" : undefined,
              background: verifyError ? "#fff0f0" : undefined,
            }}
          />
          <div className="verify-code">5E694E</div>
          <button
            onClick={() => {
              if (verifyCode.trim() !== "5E694E") {
                setVerifyError(true);
                return;
              }
              setVerifyError(false);
              alert("Message sent!");
              setMessage("");
              setMsgQty("");
              setMsgType("");
              setVerifyCode("");
            }}
          >
            <i className="bi bi-send"></i> Send
          </button>
          {verifyError && (
            <div style={{ color: "#ff4d4f", marginTop: 4, fontSize: 13 }}>
              Please enter the correct verification code.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
