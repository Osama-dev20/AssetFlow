import { useState, useMemo } from "react";
import "./Audience.css";

import { assets } from "../../../assets/assets";
import { useApp } from "../../../context/AppContext";
import { landingData } from "../../../data/landingData";

const imageMap = {
  healthcare: assets.medical1,
  education: assets.Education,
  industrial: assets.Factories,
  utilities: assets.water2,
};

function Audience() {
  const { language } = useApp();
  const t = landingData[language]?.audience || landingData.en.audience;

  const [activeId, setActiveId] = useState("healthcare");

  const currentAudience = useMemo(() => {
    return t.audiences.find((a) => a.id === activeId) || t.audiences[0];
  }, [t, activeId]);

  return (
    <section className="audience" id="audience">
      <div className="audience-container">

        {/* Header */}
        <div className="audience-header">
          <span className="section-label">
            {t.label}
          </span>

          <h2>
            {t.titlePart1}
            <span> {t.titlePart2}</span>
          </h2>

          <p>
            {t.description}
          </p>
        </div>


        {/* Content */}
        <div className="audience-content">

          {/* Smooth Cross-Fading Images Container */}
          <div className="audience-image-wrapper">
            <div className="audience-ambient-card-glow" />

            {t.audiences.map((audience) => {
              const isActive = activeId === audience.id;
              return (
                <img
                  key={audience.id}
                  src={imageMap[audience.id] || assets.medical1}
                  alt={audience.title}
                  className={`audience-crossfade-img ${isActive ? "is-active-img" : ""}`}
                />
              );
            })}

            {/* Active overlay caption badge */}
            <div className="audience-image-glass-badge">
              <span className="audience-badge-tag">{currentAudience.tag || "Enterprise"}</span>
              <p className="audience-badge-title">{currentAudience.title}</p>
            </div>
          </div>


          {/* Interactive Audience Tabs */}
          <div className="audience-list">
            {t.audiences.map((audience) => {
              const isActive = activeId === audience.id;
              return (
                <button
                  key={audience.id}
                  className={`audience-item ${isActive ? "active" : ""}`}
                  onClick={() => setActiveId(audience.id)}
                  onMouseEnter={() => setActiveId(audience.id)}
                  aria-selected={isActive}
                >
                  <div className="audience-item-indicator" />

                  <div className="audience-item-content">
                    <div className="audience-item-top">
                      <span className="audience-item-title">
                        {audience.title}
                      </span>
                      {audience.tag && (
                        <span className="audience-item-tag">{audience.tag}</span>
                      )}
                    </div>

                    <div className={`audience-desc-wrapper ${isActive ? "expanded" : ""}`}>
                      <p>{audience.description}</p>
                    </div>
                  </div>

                  <span className="audience-arrow">
                    {language === "ar" ? "←" : "→"}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

export default Audience;