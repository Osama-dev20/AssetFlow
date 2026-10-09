import "./Hero.css";
import { useState, useRef } from "react";
import { assets } from "../../../assets/assets";
import { useApp } from "../../../context/AppContext";
import { landingData } from "../../../data/landingData";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Hero() {
  const { language } = useApp();
  const t = landingData[language]?.hero || landingData.en.hero;

  // 3D Interactive Mouse Tilt (Follows cursor, zero automatic idle movement)
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth 3D tilt tracking the cursor
    const rotateX = ((y - centerY) / centerY) * -5.5;
    const rotateY = ((x - centerX) / centerX) * 5.5;

    setTransform(
      `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );
    setMousePos({ x, y });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setIsHovered(false);
  };

  return (
    <section className="hero" id="home">
      <div className="hero-container">

        {/* Hero Content */}
        <div className="hero-content">

          <h1>
            {t.titlePart1}
            <span> {t.titlePart2}</span>
          </h1>

          <p>
            {t.description}
          </p>

          <div className="hero-buttons">
            <a href="#how-it-works" className="hero-primary-btn">
              <span>{t.primaryBtn}</span>
              {language === "ar" ? (
                <ArrowBackIcon className="btn-icon" />
              ) : (
                <ArrowForwardIcon className="btn-icon" />
              )}
            </a>

            <a href="#features" className="hero-secondary-btn">
              <span>{t.secondaryBtn}</span>
            </a>
          </div>

        </div>


        {/* Hero Image Container with Interactive Mouse Follow 3D Card */}
        <div className="hero-image-container">
          <div className="hero-image-ambient-glow" />

          <div
            ref={cardRef}
            className="hero-image-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: transform,
            }}
          >
            <img
              src={assets.heroTechnicianFull || assets.heroImage}
              alt="Critical Asset & Maintenance Operations"
              className="hero-image"
            />

            {/* Specular sheen reflecting cursor position in 3D */}
            <div
              className={`hero-image-sheen ${isHovered ? "sheen-active" : ""}`}
              style={{
                background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.32), rgba(29, 104, 189, 0.08) 45%, transparent 75%)`,
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;