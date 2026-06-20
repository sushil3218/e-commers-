import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail("");
    }
  };

  return (
  <section
  style={{
    backgroundImage: `url('/newslatter.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "40px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "10px",
    margin: "20px auto 0 auto",
    flexWrap: "wrap",
    color: "#fff",
    border: "20px solid #ffff",         // <-- border box
    borderBottom: "3px solid #f1f1f1", // <-- bottom separator
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  }}
>

    
      {/* Left Content */}
      <div style={{ flex: "1", minWidth: "300px" }}>
        <h2
          style={{
            margin: "0 0 15px 0",
            fontWeight: "bold",
            fontSize: "26px",
          }}
        >
          Join Our Newsletter
        </h2>
        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "420px",
            borderRadius: "30px",
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          {/* Email Icon */}
          <div
            style={{
              padding: "12px 15px",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 16 16"
              style={{ color: "#4a8cac" }}
            >
              <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-.5a.5.5 0 00-.5.5v.217l6 3.6 6-3.6V4a.5.5 0 00-.5-.5H2zm13 2.383l-4.708 2.825L15 11.091V5.883zM14.8 12H1.2l3.682-2.213L1.2 7.536v4.465l4.165-2.497 1.003.602a.5.5 0 00.526 0l1.003-.602 4.165 2.497V7.536l-3.682 2.251L14.8 12z" />
            </svg>
          </div>

          {/* Input */}
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              outline: "none",
              fontSize: "14px",
            }}
          />

          {/* Subscribe Button */}
          <button
            onClick={handleSubscribe}
            style={{
              backgroundColor: "#f7931e",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            Subscribe
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 01.5-.5h11.793l-4.147-4.146a.5.5 0 11.708-.708l5 5a.5.5 0 010 .708l-5 5a.5.5 0 11-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z"
              />
            </svg>
          </button>
        </div>
      </div>

     
          
        
    </section>
  );
};

export default Newsletter;
