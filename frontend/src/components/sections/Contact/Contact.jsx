import { useState, useRef, useEffect } from "react";
import "./Contact.css";
import { useApp } from "../../../context/AppContext";
import { landingData } from "../../../data/landingData";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Send,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  User,
  Layers,
  Zap,
  Activity,
  Cpu,
} from "lucide-react";

// ========================================================
// Dedicated Scoped Canvas: Constellation Particle Physics
// ========================================================
function ContactCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;
    let mouse = { x: -9999, y: -9999, active: false };

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    };
    updateSize();

    // Responsive particle count based on canvas area
    const count = Math.min(Math.floor((width * height) / 18000), 45);
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1.2,
        color: Math.random() > 0.5 ? "rgba(56, 189, 248, " : "rgba(46, 175, 125, ",
      });
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    window.addEventListener("resize", updateSize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid dots
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      const gridSize = 48;
      for (let gx = 0; gx < width; gx += gridSize) {
        for (let gy = 0; gy < height; gy += gridSize) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce at bounds
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse magnetic pull
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            p.x += (dx / dist) * force * 0.6;
            p.y += (dy / dist) * force * 0.6;
          }
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "0.85)";
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < 120) {
            const alpha = (1 - cdist / 120) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor
        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140) {
            const mAlpha = (1 - mdist / 140) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(46, 175, 125, ${mAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateSize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="contact-interactive-canvas" />;
}

// ========================================================
// Main Contact Section Component
// ========================================================
function Contact() {
  const { language, addToast } = useApp();
  const t = landingData[language]?.contact || landingData.en.contact;

  // 3D Card Interactive Tilt & Specular Sheen
  const cardRef = useRef(null);
  const [cardTransform, setCardTransform] = useState(
    "perspective(1200px) rotateX(0deg) rotateY(0deg)"
  );
  const [cardMousePos, setCardMousePos] = useState({ x: 250, y: 250 });
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    fleetSize: t.form.fleetOptions?.[1] || "50 – 250 Assets",
    inquiryType: t.form.inquiryOptions?.[0] || "Enterprise Demo",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update defaults when language toggles
  useEffect(() => {
    if (t.form.inquiryOptions && !t.form.inquiryOptions.includes(formData.inquiryType)) {
      setFormData((prev) => ({
        ...prev,
        inquiryType: t.form.inquiryOptions[0],
        fleetSize: t.form.fleetOptions?.[1] || prev.fleetSize,
      }));
    }
  }, [language, t]);

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4.2;
    const rotateY = ((x - centerX) / centerX) * 4.2;

    setCardTransform(
      `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`
    );
    setCardMousePos({ x, y });
    setIsCardHovered(true);
  };

  const handleCardMouseLeave = () => {
    setCardTransform("perspective(1200px) rotateX(0deg) rotateY(0deg)");
    setIsCardHovered(false);
  };

  const copyEmailToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(t.directChannels.email);
      setCopiedEmail(true);
      addToast({
        type: "success",
        title: language === "ar" ? "تم النسخ" : "Email Copied",
        description: t.directChannels.copiedTooltip || "enterprise@assetflow.io copied to clipboard.",
      });
      setTimeout(() => setCopiedEmail(false), 2600);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = language === "ar" ? "يرجى كتابة الاسم الكامل" : "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = language === "ar" ? "يرجى كتابة البريد الإلكتروني" : "Work email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email =
        language === "ar" ? "صيغة البريد الإلكتروني غير صحيحة" : "Please enter a valid business email";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 550);
      addToast({
        type: "warning",
        title: language === "ar" ? "تنبيه التحقق" : "Validation Required",
        description:
          language === "ar"
            ? "يرجى إكمال الحقول المطلوبة للمتابعة."
            : "Please review and complete required fields.",
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      addToast({
        type: "success",
        title: t.form.successTitle,
        description: t.form.successDesc,
      });
    }, 850);
  };

  const benefitIcons = [
    <Zap key="b-1" className="w-5 h-5 text-[#38bdf8]" />,
    <Cpu key="b-2" className="w-5 h-5 text-[#34d399]" />,
    <ShieldCheck key="b-3" className="w-5 h-5 text-[#818cf8]" />,
  ];

  return (
    <section className="contact-section" id="contact">
      {/* Background with Ambient Glow Orbs and Scoped Constellation Canvas */}
      <div className="contact-bg-wrapper">
        <div className="contact-ambient-glow glow-blue" />
        <div className="contact-ambient-glow glow-teal" />
        <ContactCanvas />
      </div>

      <div className="contact-container">

        {/* Section Header */}
        <div className="contact-header">
          <div className="contact-header-badge">
            <Sparkles className="w-4 h-4 text-[#38bdf8]" />
            <span>{t.label}</span>
          </div>

          <h2>
            {t.titlePart1}
            <span> {t.titlePart2}</span>
          </h2>

          <p className="contact-header-desc">
            {t.description}
          </p>
        </div>


        {/* Contact Layout Grid */}
        <div className="contact-grid">

          {/* Left Column: Enterprise Operations Deck */}
          <div className="contact-left-col">

            {/* SLA & Readiness Highlights Card */}
            <div className="contact-credentials-card">
              <div className="credentials-top-row">
                <div className="credentials-live-pill">
                  <span className="live-dot-pulse" />
                  <span>{t.directChannels.uptimeBadge}</span>
                </div>
                <div className="credentials-sec-pill">
                  <ShieldCheck className="w-4 h-4 text-[#34d399]" />
                  <span>{t.directChannels.securityBadge}</span>
                </div>
              </div>

              <h3 className="credentials-title">{t.directChannels.title}</h3>
              <p className="credentials-subtitle">{t.directChannels.subtitle}</p>

              {/* Direct Channels Cards */}
              <div className="direct-channels-list">

                {/* Email Channel Card */}
                <div className="channel-card-item">
                  <div className="channel-icon-avatar">
                    <Mail className="w-5 h-5 text-[#38bdf8]" />
                  </div>
                  <div className="channel-text-wrap">
                    <span className="channel-label">{t.directChannels.emailLabel}</span>
                    <a href={`mailto:${t.directChannels.email}`} className="channel-link">
                      {t.directChannels.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={copyEmailToClipboard}
                    className="channel-copy-btn"
                    title={language === "ar" ? "نسخ البريد" : "Copy Email"}
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-[#34d399]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Phone Channel Card */}
                <div className="channel-card-item">
                  <div className="channel-icon-avatar">
                    <Phone className="w-5 h-5 text-[#34d399]" />
                  </div>
                  <div className="channel-text-wrap">
                    <span className="channel-label">{t.directChannels.phoneLabel}</span>
                    <a href={`tel:${t.directChannels.phone}`} className="channel-link">
                      {t.directChannels.phone}
                    </a>
                  </div>
                </div>

                {/* Office Location Card */}
                <div className="channel-card-item">
                  <div className="channel-icon-avatar">
                    <MapPin className="w-5 h-5 text-[#818cf8]" />
                  </div>
                  <div className="channel-text-wrap">
                    <span className="channel-label">{t.directChannels.officeLabel}</span>
                    <span className="channel-val-static">{t.directChannels.office}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Why Leading Enterprises Trust Us (Benefits Mini-Deck) */}
            <div className="contact-benefits-deck">
              {t.benefits?.map((benefit, idx) => (
                <div key={idx} className="benefit-item-card">
                  <div className="benefit-icon-wrap">
                    {benefitIcons[idx % benefitIcons.length]}
                  </div>
                  <div className="benefit-text-wrap">
                    <h4 className="benefit-title">{benefit.title}</h4>
                    <p className="benefit-desc">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>


          {/* Right Column: 3D Glass Interactive Form */}
          <div className="contact-right-col">
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform: cardTransform,
                transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease-out",
              }}
              className={`contact-3d-card ${isShaking ? "animate-shake" : ""}`}
            >
              {/* Dynamic 3D Cursor Specular Light Sheen */}
              <div
                className={`card-light-sheen ${isCardHovered ? "sheen-on" : ""}`}
                style={{
                  background: `radial-gradient(420px circle at ${cardMousePos.x}px ${cardMousePos.y}px, rgba(56, 189, 248, 0.18), rgba(46, 175, 125, 0.08) 42%, transparent 75%)`,
                }}
              />

              {isSubmitted ? (
                /* Success Confirmation State */
                <div className="form-success-state">
                  <div className="success-icon-pulse">
                    <CheckCircle2 className="w-16 h-16 text-[#34d399]" />
                  </div>
                  <h3>{t.form.successTitle}</h3>
                  <p>{t.form.successDesc}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        company: "",
                        fleetSize: t.form.fleetOptions?.[1] || "50 – 250 Assets",
                        inquiryType: t.form.inquiryOptions?.[0] || "Enterprise Demo",
                        message: "",
                      });
                    }}
                    className="form-reset-btn"
                  >
                    <span>{t.form.resetBtn}</span>
                  </button>
                </div>
              ) : (
                /* Interactive Form */
                <form onSubmit={handleSubmit} className="contact-form-body" noValidate>

                  {/* Form Header */}
                  <div className="form-intro-row">
                    <h3>{t.form.headerTitle}</h3>
                    <p>{t.form.headerSubtitle}</p>
                  </div>

                  {/* Inquiry Intent Selector (Pill Tabs) */}
                  <div className="form-pills-group">
                    <span className="pills-group-label">{t.form.inquiryType}</span>
                    <div className="inquiry-pills-wrap">
                      {t.form.inquiryOptions?.map((option) => {
                        const isSelected = formData.inquiryType === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, inquiryType: option })}
                            className={`inquiry-pill-btn ${isSelected ? "is-active-pill" : ""}`}
                          >
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Full Name & Work Email Inputs */}
                  <div className="form-fields-grid">
                    <div className="form-field-group">
                      <label>
                        {t.form.fullName} <span className="field-required">*</span>
                      </label>
                      <div className="input-with-icon">
                        <User className="input-icon-svg" />
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData({ ...formData, fullName: e.target.value });
                            if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                          }}
                          placeholder={t.form.fullNamePlaceholder}
                          className={errors.fullName ? "input-has-error" : ""}
                        />
                      </div>
                      {errors.fullName && <span className="field-error-text">{errors.fullName}</span>}
                    </div>

                    <div className="form-field-group">
                      <label>
                        {t.form.email} <span className="field-required">*</span>
                      </label>
                      <div className="input-with-icon">
                        <Mail className="input-icon-svg" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          placeholder={t.form.emailPlaceholder}
                          className={errors.email ? "input-has-error" : ""}
                        />
                      </div>
                      {errors.email && <span className="field-error-text">{errors.email}</span>}
                    </div>
                  </div>

                  {/* Company Name & Asset Fleet Size */}
                  <div className="form-fields-grid">
                    <div className="form-field-group">
                      <label>{t.form.company}</label>
                      <div className="input-with-icon">
                        <Activity className="input-icon-svg" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder={t.form.companyPlaceholder}
                        />
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label>{t.form.fleetSize}</label>
                      <div className="input-with-icon">
                        <Layers className="input-icon-svg" />
                        <select
                          value={formData.fleetSize}
                          onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                        >
                          {t.form.fleetOptions?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Operational Notes / Message */}
                  <div className="form-field-group">
                    <label>{t.form.message}</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.form.messagePlaceholder}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="contact-submit-btn"
                  >
                    {isSubmitting ? (
                      <span className="btn-loading-text">
                        <span className="btn-spinner" />
                        {t.form.submitting}
                      </span>
                    ) : (
                      <>
                        <span>{t.form.submitBtn}</span>
                        <Send className="w-4 h-4 submit-send-icon" />
                      </>
                    )}
                  </button>

                  <p className="form-footer-assurance">
                    🔒 {language === "ar"
                      ? "بيانات منشأتك محمية ومشفرة بموجب اتفاقيات سرية المعلومات ومعايير ISO."
                      : "Your infrastructure data is protected under enterprise NDA and encrypted in transit."}
                  </p>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Contact;
