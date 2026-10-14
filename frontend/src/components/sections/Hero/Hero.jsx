import "./Hero.css";
import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../../assets/assets";
import { useApp } from "../../../context/AppContext";
import { landingData } from "../../../data/landingData";
import { ShinyButton } from "../../ui/shiny-button";
import { ArrowLeft, ArrowRight } from "lucide-react";

function Hero() {
  const { language } = useApp();
  const t = landingData[language]?.hero || landingData.en.hero;

  // Ultra-smooth 60-120fps Direct GPU Tilt (No React state re-render loop & cached rect)
  const cardRef = useRef(null);
  const cardRectRef = useRef(null);
  const sheenRef = useRef(null);
  const rafId = useRef(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      cardRectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    if (!cardRectRef.current) {
      cardRectRef.current = cardRef.current.getBoundingClientRect();
    }
    const rect = cardRectRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5.5;
    const rotateY = ((x - centerX) / centerX) * 5.5;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      }
      if (sheenRef.current) {
        sheenRef.current.style.opacity = "1";
        sheenRef.current.style.background = `radial-gradient(420px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.32), rgba(29, 104, 189, 0.08) 45%, transparent 75%)`;
      }
    });
  };

  const handleMouseLeave = () => {
    cardRectRef.current = null;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
    if (sheenRef.current) {
      sheenRef.current.style.opacity = "0";
    }
  };

  useEffect(() => {
    const handleScrollOrResize = () => {
      cardRectRef.current = null;
    };
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

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

          <div className="hero-buttons flex items-center flex-wrap gap-4">
            <Link to="/login">
              <ShinyButton
                label={t.primaryBtn}
                fillColor="#0f172a"
                accentColor="#1d68bd"
                accentSoftColor="#2eaf7d"
                className="py-3 px-6 text-sm"
              >
                <span>{t.primaryBtn}</span>
                {language === "ar" ? (
                  <ArrowLeft className="btn-icon w-4 h-4 inline-block ms-1.5" />
                ) : (
                  <ArrowRight className="btn-icon w-4 h-4 inline-block ms-1.5" />
                )}
              </ShinyButton>
            </Link>

            <a href="#services-wheel" className="hero-secondary-btn">
              <span>{language === "ar" ? "استكشف الخدمات الحيوية" : "Explore Services Wheel"}</span>
            </a>
          </div>

        </div>


        {/* Hero Image Container with Interactive Mouse Follow 3D Card */}
        <div className="hero-image-container">
          <div className="hero-image-ambient-glow" />

          <div
            ref={cardRef}
            className="hero-image-wrapper will-change-transform transition-transform duration-100 ease-out"
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            }}
          >
            <img
              src={assets.heroTechnicianFull || assets.heroImage}
              alt="Critical Asset & Maintenance Operations"
              className="hero-image"
              fetchPriority="high"
              decoding="async"
              width="640"
              height="480"
            />

            {/* Specular sheen reflecting cursor position in 3D */}
            <div
              ref={sheenRef}
              className="hero-image-sheen transition-opacity duration-300"
              style={{ opacity: 0 }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;