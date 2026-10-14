import "./AboutProduct.css";
import { useApp } from "../../../context/AppContext";
import { landingData } from "../../../data/landingData";
import { Layers, Network, ShieldCheck } from "lucide-react";
import { GlowCard } from "../../ui/glow-card";

const cardIcons = [
  <Layers key="icon-1" className="about-card-icon-svg" />,
  <Network key="icon-2" className="about-card-icon-svg" />,
  <ShieldCheck key="icon-3" className="about-card-icon-svg" />,
];

const cardGlowColors = ["blue", "teal", "purple"];

function AboutProduct() {
  const { language } = useApp();
  const t = landingData[language]?.aboutProduct || landingData.en.aboutProduct;

  return (
    <section className="about-product" id="features">
      <div className="about-product-container">

        <div className="about-product-header">
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

        <div className="about-product-cards">
          {t.cards.map((card, idx) => {
            const glowColor = cardGlowColors[idx % cardGlowColors.length];
            return (
              <GlowCard
                key={card.num}
                glowColor={glowColor}
                className="p-8 cursor-pointer flex flex-col justify-between"
              >
                {/* Top Accent Gradient Border */}
                <div className="card-top-accent" />

                {/* Card Header with Icon & Number */}
                <div className="card-header-row">
                  <div className="card-icon-bubble">
                    {cardIcons[idx]}
                  </div>
                  <span className="card-number font-mono">{card.num}</span>
                </div>

                <h3>{card.title}</h3>
                {card.subTitle && (
                  <span className="text-xs font-semibold text-blue-600 block mb-2 font-mono" dir="ltr">
                    {card.subTitle}
                  </span>
                )}
                <p>{card.desc}</p>
              </GlowCard>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default AboutProduct;