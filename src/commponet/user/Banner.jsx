import { useState, useEffect } from "react";

export default function Banner() {
  const banners = ["/banner-1.jpg", "/banner-2.jpg"]; // put images in /public
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section className="banner-section">
      <img src={banners[current]} alt="Banner" />

      {/* Dots */}
      <div className="banner-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={current === index ? "active" : ""}
          ></button>
        ))}
      </div>
    </section>
  );
}
