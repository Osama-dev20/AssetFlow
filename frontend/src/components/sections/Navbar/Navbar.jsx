import "./Navbar.css";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Globe, LogOut, Menu, X, ArrowUpRight, UserPlus, ChevronDown } from "lucide-react";

import { useApp } from "../../../context/AppContext";
import { landingData } from "../../../data/landingData";

function getGreetingInfo(language) {
  const hour = new Date().getHours();
  if (language === "ar") {
    if (hour >= 5 && hour < 12) return { text: "صباح الخير", icon: "🌅" };
    if (hour >= 12 && hour < 18) return { text: "مساء الخير", icon: "☀️" };
    return { text: "مساء النور", icon: "🌙" };
  } else {
    if (hour >= 5 && hour < 12) return { text: "Good Morning", icon: "🌅" };
    if (hour >= 12 && hour < 18) return { text: "Good Afternoon", icon: "☀️" };
    return { text: "Good Evening", icon: "🌙" };
  }
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isContactPage = location.pathname === "/contact";
  const [activeSection, setActiveSection] = useState(isContactPage ? "contact" : "home");
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { currentUser, setCurrentUser, addToast, language, toggleLanguage } = useApp();

  const [greeting, setGreeting] = useState(() => getGreetingInfo(language));
  const nav = landingData[language]?.nav || landingData.en.nav;

  // On page refresh/load: Show greeting bubble for 2.2 seconds, then smoothly morph into horizontal navbar
  useEffect(() => {
    setGreeting(getGreetingInfo(language));
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, [language]);

  // Dynamic time greeting update every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreetingInfo(language));
    }, 30000);
    return () => clearInterval(interval);
  }, [language]);

  // Bulletproof Scroll Spy: Tracks whichever section is currently visible in viewport
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ["home", "what-is-assetflow", "audience", "how-it-works", "contact"];
      const viewportThreshold = window.innerHeight * 0.35;

      let found = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportThreshold && rect.bottom >= viewportThreshold) {
            found = id;
            break;
          }
        }
      }
      setActiveSection(found);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "home", label: nav.home, href: isContactPage ? "/#home" : "#home", isRoute: false },
    { id: "features", label: nav.about, href: isContactPage ? "/#features" : "#features", isRoute: false },
    { id: "audience", label: nav.audience, href: isContactPage ? "/#audience" : "#audience", isRoute: false },
    { id: "how-it-works", label: nav.howItWorks, href: isContactPage ? "/#how-it-works" : "#how-it-works", isRoute: false },
    { id: "contact", label: nav.contact, href: "/contact", isRoute: true },
  ];

  // Close user dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleSwitchAccount = () => {
    setUserMenuOpen(false);
    navigate("/login");
    addToast({
      type: "info",
      title: language === "ar" ? "تبديل الحساب" : "Switch Account",
      description: language === "ar" ? "يرجى تسجيل الدخول بالحساب المطلوب." : "Please log in with another account.",
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserMenuOpen(false);
    addToast({
      type: "info",
      title: language === "ar" ? "تم تسجيل الخروج" : "Logged Out",
      description: language === "ar" ? "تم تسجيل خروجك بنجاح." : "You have been logged out successfully.",
    });
  };

  const displayName =
    currentUser?.fullName || currentUser?.name || currentUser?.email?.split("@")[0] || "User";
  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="floating-navbar-wrapper">
      <div className="floating-navbar-container">

        {/* 1. Left Pill: Brand Logo */}
        <Link to="/" className="nav-pill nav-logo-pill">
          <div className="nav-logo-icon">
            <svg viewBox="0 0 100 100" fill="none" className="w-5 h-5">
              <rect width="100" height="100" rx="26" fill="url(#nav-logo-grad)" />
              <path d="M26 30 C 50 30, 52 50, 70 50" stroke="#93C5FD" strokeWidth="6" strokeLinecap="round" />
              <path d="M26 50 L 70 50" stroke="#93C5FD" strokeWidth="6" strokeLinecap="round" />
              <path d="M26 70 C 50 70, 52 50, 70 50" stroke="#93C5FD" strokeWidth="6" strokeLinecap="round" />
              <circle cx="26" cy="30" r="10" fill="#FFFFFF" />
              <circle cx="26" cy="50" r="10" fill="#FFFFFF" />
              <circle cx="26" cy="70" r="10" fill="#FFFFFF" />
              <circle cx="70" cy="50" r="14" fill="#34D399" />
              <defs>
                <linearGradient id="nav-logo-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1D68BD" />
                  <stop offset="1" stopColor="#2EAF7D" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="nav-brand-title">AssetFlow</span>
        </Link>

        {/* 2. Center Island: Starts as Greeting Bubble, then smoothly Morphs into Full Horizontal Nav */}
        <div
          className={`nav-pill nav-center-island ${isExpanded ? "island-expanded" : "island-bubble"}`}
          onClick={() => !isExpanded && setIsExpanded(true)}
          title={!isExpanded ? "Click to expand navigation" : undefined}
        >
          {/* A. Initial Greeting Bubble State */}
          {!isExpanded ? (
            <div className="nav-bubble-content">
              <span className="nav-bubble-icon">{greeting.icon}</span>
              <span className="nav-bubble-text">{greeting.text}</span>
            </div>
          ) : (
            /* B. Fully Expanded Horizontal Navigation with Illuminated Glowing Notch */
            <nav className="nav-expanded-content">
              <ul className="nav-center-links">
                {navLinks.map((link) => {
                  const isActive = isContactPage ? link.id === "contact" : activeSection === link.id;
                  return (
                    <li key={link.id} className="nav-item-wrapper">
                      {link.isRoute ? (
                        <Link
                          to={link.href}
                          className={`nav-center-link ${isActive ? "is-active" : ""}`}
                          onClick={() => setActiveSection(link.id)}
                        >
                          {isActive && <span className="nav-glowing-notch" />}
                          <span>{link.label}</span>
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className={`nav-center-link ${isActive ? "is-active" : ""}`}
                          onClick={() => setActiveSection(link.id)}
                        >
                          {isActive && <span className="nav-glowing-notch" />}
                          <span>{link.label}</span>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* User profile or CTA buttons */}
              {currentUser ? (
                <div className="nav-user-pill-container" ref={userMenuRef}>
                  <button
                    type="button"
                    className={`nav-user-btn ${userMenuOpen ? "is-menu-open" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    aria-label="User Profile"
                  >
                    <span className="nav-user-avatar">{userInitials}</span>
                    <span className="nav-user-name">{displayName}</span>
                    <ChevronDown className={`w-3.5 h-3.5 nav-user-chevron ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="nav-dropdown-menu">
                      <div className="nav-dropdown-header">
                        <div className="nav-dropdown-user-row">
                          <span className="nav-dropdown-avatar">{userInitials}</span>
                          <div className="nav-dropdown-user-info">
                            <p className="nav-dropdown-name">{displayName}</p>
                            <p className="nav-dropdown-email">{currentUser.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="nav-dropdown-actions">
                        <button
                          type="button"
                          onClick={handleSwitchAccount}
                          className="nav-dropdown-item nav-dropdown-switch"
                        >
                          <UserPlus className="w-4 h-4 text-[#38bdf8]" />
                          <span>{nav.switchAccount || (language === "ar" ? "استخدام حساب آخر" : "Use Another Account")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="nav-dropdown-item nav-dropdown-logout"
                        >
                          <LogOut className="w-4 h-4 text-[#f87171]" />
                          <span>{nav.logOut || (language === "ar" ? "تسجيل الخروج" : "Log Out")}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="nav-cta-actions">
                  <Link to="/login" className="nav-island-login">
                    {nav.login}
                  </Link>
                  <Link to="/signup" className="nav-island-cta">
                    <span>{nav.signUp}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </nav>
          )}
        </div>

        {/* 3. Right Pill: Language Switcher Capsule & Mobile Toggle */}
        <div className="nav-right-group">
          {/* Animated Language Switcher with Spinning Globe */}
          <button
            onClick={toggleLanguage}
            type="button"
            className="nav-pill nav-lang-pill group"
            title="Switch Language / تبديل اللغة"
            aria-label="Switch Language"
          >
            <Globe className="nav-globe-icon" />
            <span className="nav-lang-label">
              {language === "ar" ? "English" : "العربية"}
            </span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            className="nav-mobile-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="nav-mobile-drawer">
          <ul className="nav-mobile-links">
            {navLinks.map((link) => {
              const isActive = isContactPage ? link.id === "contact" : activeSection === link.id;
              return (
                <li key={link.id}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      onClick={() => {
                        setActiveSection(link.id);
                        setMenuOpen(false);
                      }}
                      className={isActive ? "mobile-active" : ""}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => {
                        setActiveSection(link.id);
                        setMenuOpen(false);
                      }}
                      className={isActive ? "mobile-active" : ""}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="nav-mobile-auth">
            {currentUser ? (
              <div className="mobile-user-profile-box">
                <div className="mobile-user-row">
                  <span className="nav-user-avatar">{userInitials}</span>
                  <div className="mobile-user-info">
                    <p className="mobile-user-name">{displayName}</p>
                    <p className="mobile-user-email">{currentUser.email}</p>
                  </div>
                </div>
                <div className="mobile-user-btn-group">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleSwitchAccount();
                    }}
                    className="mobile-switch-btn"
                  >
                    <UserPlus className="w-4 h-4 text-[#38bdf8]" />
                    <span>{nav.switchAccount || (language === "ar" ? "استخدام حساب آخر" : "Use Another Account")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="mobile-logout-btn"
                  >
                    <LogOut className="w-4 h-4 text-[#f87171]" />
                    <span>{nav.logOut || (language === "ar" ? "تسجيل الخروج" : "Log Out")}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-btns">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="mobile-login-link">
                  {nav.login}
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="mobile-signup-link">
                  {nav.signUp}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;