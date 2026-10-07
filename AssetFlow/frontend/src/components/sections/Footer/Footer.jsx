import "./Footer.css";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../../../context/AppContext";
import { landingData } from "../../../data/landingData";
import { Globe, ArrowUp } from "lucide-react";

const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

function Footer() {
  const { language, toggleLanguage } = useApp();
  const location = useLocation();
  const isContactPage = location.pathname === "/contact";
  const t = landingData[language]?.footer || landingData.en.footer;
  const nav = landingData[language]?.nav || landingData.en.nav;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-section">
      {/* Top Gradient Divider Line */}
      <div className="footer-top-glow-line" />

      <div className="footer-container">

        {/* Main Footer Row */}
        <div className="footer-main-grid">

          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo-row">
              <div className="footer-logo-icon">
                <svg viewBox="0 0 100 100" fill="none" className="w-6 h-6">
                  <rect width="100" height="100" rx="26" fill="url(#footer-logo-grad)" />
                  <path d="M26 30 C 50 30, 52 50, 70 50" stroke="#93C5FD" strokeWidth="6" strokeLinecap="round" />
                  <path d="M26 50 L 70 50" stroke="#93C5FD" strokeWidth="6" strokeLinecap="round" />
                  <path d="M26 70 C 50 70, 52 50, 70 50" stroke="#93C5FD" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="26" cy="30" r="10" fill="#FFFFFF" />
                  <circle cx="26" cy="50" r="10" fill="#FFFFFF" />
                  <circle cx="26" cy="70" r="10" fill="#FFFFFF" />
                  <circle cx="70" cy="50" r="14" fill="#34D399" />
                  <defs>
                    <linearGradient id="footer-logo-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1D68BD" />
                      <stop offset="1" stopColor="#2EAF7D" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="footer-brand-title">AssetFlow</span>
            </Link>

            <p className="footer-tagline">
              {t.tagline}
            </p>
          </div>


          {/* Links Column 1: Navigation */}
          <div className="footer-links-col">
            <h4>{t.quickLinks}</h4>
            <ul>
              <li><a href={isContactPage ? "/#home" : "#home"}>{nav.home}</a></li>
              <li><a href={isContactPage ? "/#features" : "#features"}>{nav.about}</a></li>
              <li><a href={isContactPage ? "/#audience" : "#audience"}>{nav.audience}</a></li>
              <li><a href={isContactPage ? "/#how-it-works" : "#how-it-works"}>{nav.howItWorks}</a></li>
              <li><Link to="/contact">{nav.contact}</Link></li>
            </ul>
          </div>


          {/* Links Column 2: Solutions */}
          <div className="footer-links-col">
            <h4>{language === "ar" ? "القطاعات" : "Solutions"}</h4>
            <ul>
              <li><a href={isContactPage ? "/#audience" : "#audience"}>{language === "ar" ? "المستشفيات والرعاية الصحية" : "Healthcare & Clinical"}</a></li>
              <li><a href={isContactPage ? "/#audience" : "#audience"}>{language === "ar" ? "التعليم والجامعات" : "Higher Education"}</a></li>
              <li><a href={isContactPage ? "/#audience" : "#audience"}>{language === "ar" ? "المصانع وخطوط الإنتاج" : "Industrial & Manufacturing"}</a></li>
              <li><a href={isContactPage ? "/#audience" : "#audience"}>{language === "ar" ? "المرافق العامة والطاقة" : "Energy & Utilities"}</a></li>
            </ul>
          </div>


          {/* Links Column 3: Trust & Legal */}
          <div className="footer-links-col">
            <h4>{t.legal}</h4>
            <ul>
              <li><a href="#privacy">{t.privacy}</a></li>
              <li><a href="#terms">{t.terms}</a></li>
              <li><a href="#security">{t.security}</a></li>
              <li>
                <button onClick={toggleLanguage} className="footer-lang-btn">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language === "ar" ? "English" : "العربية"}</span>
                </button>
              </li>
            </ul>
          </div>

        </div>


        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} {t.copyright}
          </p>

          <div className="footer-social-icons">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="social-icon-btn">
              <GithubIcon />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-icon-btn">
              <LinkedinIcon />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="social-icon-btn">
              <TwitterIcon />
            </a>
          </div>

          <button onClick={scrollToTop} className="footer-back-to-top" aria-label="Scroll to top">
            <span>{language === "ar" ? "للأعلى" : "Back to top"}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
