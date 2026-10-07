import "./HowItWorks.css";

import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";

import { assets } from "../../../assets/assets";
import { useApp } from "../../../context/AppContext";
import { landingData } from "../../../data/landingData";

const stepIcons = [
  <ReportProblemOutlinedIcon key="step-1" />,
  <SearchOutlinedIcon key="step-2" />,
  <BuildOutlinedIcon key="step-3" />,
];

function HowItWorks() {
  const { language } = useApp();
  const t = landingData[language]?.howItWorks || landingData.en.howItWorks;

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works-container">

        {/* Header */}
        <div className="how-it-works-header">
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


        {/* Story */}
        <div className="maintenance-story">

          {/* Image */}
          <div className="story-image">
            <img
              src={assets.water4}
              alt="Technician performing maintenance"
            />

            <div className="story-image-label">
              <span>{t.imageBadge}</span>
              <p>{t.imageSubtitle}</p>
            </div>
          </div>


          {/* Steps */}
          <div className="story-steps">
            {t.steps.map((step, idx) => (
              <div className="story-step" key={step.num}>
                <div className="story-step-number">
                  {step.num}
                </div>

                <div className="story-step-content">
                  <div className="story-step-icon">
                    {stepIcons[idx]}
                  </div>

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>


        {/* Bottom statement */}
        <div className="how-it-works-bottom">
          <span>{t.bottomTagline}</span>
          <p>{t.bottomDesc}</p>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;