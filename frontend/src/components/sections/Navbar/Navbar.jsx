import "./Navbar.css";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Globe,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  UserPlus,
  ChevronDown,
  LayoutDashboard,
  Home,
  Layers,
  Cpu,
  Users,
  Sparkles,
  Mail,
} from "lucide-react";

import { LimelightNav } from "../../ui/limelight-nav";
import { useApp } from "../../../context/AppContext";
import { landingData } from "../../../data/landingData";
import { assets } from "../../../assets/assets";

function getGreetingInfo(language) {
  const hour = new Date().getHours();

  if (language === "ar") {
    if (hour >= 5 && hour < 12) {
      return { text: "صباح الخير", icon: "🌅" };
    }

    if (hour >= 12 && hour < 18) {
      return { text: "مساء الخير", icon: "☀️" };
    }

    return { text: "مساء النور", icon: "🌙" };
  }

  if (hour >= 5 && hour < 12) {
    return { text: "Good Morning", icon: "🌅" };
  }

  if (hour >= 12 && hour < 18) {
    return { text: "Good Afternoon", icon: "☀️" };
  }

  return { text: "Good Evening", icon: "🌙" };
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isContactPage = location.pathname === "/contact";

  const [activeSection, setActiveSection] = useState(
    isContactPage ? "contact" : "home"
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  // Prevent the scroll observer from overriding the clicked destination.
  const navigationTargetRef = useRef(null);
  const navigationTimeoutRef = useRef(null);

  const {
    currentUser,
    setCurrentUser,
    addToast,
    language,
    toggleLanguage,
  } = useApp();

  const [greeting, setGreeting] = useState(() =>
    getGreetingInfo(language)
  );

  const nav = landingData[language]?.nav || landingData.en.nav;

  // Greeting bubble to expanded navigation.
  useEffect(() => {
    setGreeting(getGreetingInfo(language));

    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, [language]);

  // Update greeting according to the current time.
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreetingInfo(language));
    }, 30000);

    return () => clearInterval(interval);
  }, [language]);

  // Scroll spy.
  useEffect(() => {
    if (isContactPage) {
      setActiveSection("contact");
      return;
    }

    const sectionIds = [
      "home",
      "features",
      "services-wheel",
      "audience",
      "how-it-works",
    ];

    const visibleSections = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections.set(
            entry.target.id,
            entry.isIntersecting
          );
        });

        // Keep the clicked destination active during smooth scrolling.
        const targetId = navigationTargetRef.current;

        if (targetId) {
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            const targetTop =
              targetElement.getBoundingClientRect().top;

            if (Math.abs(targetTop - 90) > 25) {
              return;
            }
          }

          navigationTargetRef.current = null;

          if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
            navigationTimeoutRef.current = null;
          }
        }

        // Select the first visible section in document order.
        for (const id of sectionIds) {
          if (visibleSections.get(id)) {
            setActiveSection((previous) =>
              previous === id ? previous : id
            );
            return;
          }
        }

        if (window.scrollY < 140) {
          setActiveSection((previous) =>
            previous === "home" ? previous : "home"
          );
        }
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: [0, 0.15],
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);

      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();

      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [isContactPage]);

  const navLinks = [
    {
      id: "home",
      label: nav.home,
      href: isContactPage ? "/#home" : "#home",
      isRoute: false,
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: "features",
      label: nav.about,
      href: isContactPage ? "/#features" : "#features",
      isRoute: false,
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: "services-wheel",
      label:
        nav.servicesWheel ||
        (language === "ar" ? "الخدمات الحيوية" : "Services"),
      href: isContactPage
        ? "/#services-wheel"
        : "#services-wheel",
      isRoute: false,
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      id: "audience",
      label: nav.audience,
      href: isContactPage ? "/#audience" : "#audience",
      isRoute: false,
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "how-it-works",
      label: nav.howItWorks,
      href: isContactPage
        ? "/#how-it-works"
        : "#how-it-works",
      isRoute: false,
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: "contact",
      label: nav.contact,
      href: "/contact",
      isRoute: true,
      icon: <Mail className="w-4 h-4" />,
    },
  ];

  const activeNavIndex = Math.max(
    0,
    navLinks.findIndex((link) =>
      isContactPage
        ? link.id === "contact"
        : link.id === activeSection
    )
  );

  const handleNavClick = (event, link) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }

    if (link.isRoute) {
      navigationTargetRef.current = null;

      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }

      navigate(link.href);
      return;
    }

    if (isContactPage) {
      navigate(link.href);
      return;
    }

    document.body.style.overflow = "";
    window.dispatchEvent(new CustomEvent("dismiss-intro"));

    // Set the clicked item active immediately.
    setActiveSection(link.id);
    navigationTargetRef.current = link.id;

    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Safety fallback in case the observer doesn't report the target.
    navigationTimeoutRef.current = setTimeout(() => {
      navigationTargetRef.current = null;
      navigationTimeoutRef.current = null;
    }, 2500);

    window.history.pushState(null, "", `#${link.id}`);

    const targetElement = document.getElementById(link.id);

    if (targetElement) {
      const headerOffset = 90;

      const elementPosition =
        targetElement.getBoundingClientRect().top;

      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  };

  // Navigation click handling happens only through onTabChange.
  const limelightItems = navLinks.map((link) => ({
    id: link.id,
    icon: link.icon,
    label: link.label,
  }));

  // Close the user menu when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [userMenuOpen]);

  const handleSwitchAccount = () => {
    setUserMenuOpen(false);
    navigate("/login");

    addToast({
      type: "info",
      title:
        language === "ar" ? "تبديل الحساب" : "Switch Account",
      description:
        language === "ar"
          ? "يرجى تسجيل الدخول بالحساب المطلوب."
          : "Please log in with another account.",
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserMenuOpen(false);

    addToast({
      type: "info",
      title:
        language === "ar" ? "تم تسجيل الخروج" : "Logged Out",
      description:
        language === "ar"
          ? "تم تسجيل خروجك بنجاح."
          : "You have been logged out successfully.",
    });
  };

  const displayName =
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="floating-navbar-wrapper">
      <div className="floating-navbar-container">
        {/* Brand Logo */}
        <Link
          to="/"
          className="nav-pill nav-logo-pill"
          title="AssetFlow Enterprise"
        >
          <img
            src={assets.logoDarkTheme}
            alt="AssetFlow"
            className="h-6 sm:h-6.5 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(56,189,248,0.35)] hover:scale-105 transition-all duration-300"
          />
        </Link>

        {/* Center Navigation */}
        <div
          className={`nav-pill nav-center-island ${
            isExpanded ? "island-expanded" : "island-bubble"
          }`}
          onClick={() => !isExpanded && setIsExpanded(true)}
          title={
            !isExpanded
              ? "Click to expand navigation"
              : undefined
          }
        >
          {!isExpanded ? (
            <div className="nav-bubble-content">
              <span className="nav-bubble-icon">
                {greeting.icon}
              </span>
              <span className="nav-bubble-text">
                {greeting.text}
              </span>
            </div>
          ) : (
            <nav className="nav-expanded-content">
              <LimelightNav
                items={limelightItems}
                activeIndex={activeNavIndex}
                showLabels={true}
                className="bg-transparent border-0 shadow-none px-1 h-10 sm:h-11 overflow-visible"
                limelightClassName="bg-white shadow-[0_0_20px_#ffffff,0_0_35px_rgba(255,255,255,0.9),0_0_55px_rgba(56,189,248,0.5)]"
                onTabChange={(index) => {
                  const link = navLinks[index];

                  if (link) {
                    handleNavClick(null, link);
                  }
                }}
              />

              {/* User Profile */}
              {currentUser ? (
                <div
                  className="nav-user-pill-container"
                  ref={userMenuRef}
                >
                  <button
                    type="button"
                    className={`nav-user-btn ${
                      userMenuOpen ? "is-menu-open" : ""
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    aria-label="User Profile"
                  >
                    <span className="nav-user-avatar">
                      {userInitials}
                    </span>

                    <span className="nav-user-name">
                      {displayName}
                    </span>

                    <ChevronDown
                      className={`w-3.5 h-3.5 nav-user-chevron ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="nav-dropdown-menu">
                      <div className="nav-dropdown-header">
                        <div className="nav-dropdown-user-row">
                          <span className="nav-dropdown-avatar">
                            {userInitials}
                          </span>

                          <div className="nav-dropdown-user-info">
                            <p className="nav-dropdown-name">
                              {displayName}
                            </p>

                            <p className="nav-dropdown-email">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="nav-dropdown-actions">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="nav-dropdown-item nav-dropdown-switch font-semibold text-[#34d399]"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#34d399]" />
                          <span>
                            {language === "ar"
                              ? "لوحة التحكم (Dashboard)"
                              : "Go to Dashboard"}
                          </span>
                        </Link>

                        <button
                          type="button"
                          onClick={handleSwitchAccount}
                          className="nav-dropdown-item nav-dropdown-switch"
                        >
                          <UserPlus className="w-4 h-4 text-[#38bdf8]" />
                          <span>
                            {nav.switchAccount ||
                              (language === "ar"
                                ? "استخدام حساب آخر"
                                : "Use Another Account")}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="nav-dropdown-item nav-dropdown-logout"
                        >
                          <LogOut className="w-4 h-4 text-[#f87171]" />
                          <span>
                            {nav.logOut ||
                              (language === "ar"
                                ? "تسجيل الخروج"
                                : "Log Out")}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="nav-cta-actions">
                  <Link
                    to="/login"
                    className="nav-island-login"
                  >
                    {nav.login}
                  </Link>

                  <Link
                    to="/signup"
                    className="nav-island-cta"
                  >
                    <span>{nav.signUp}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </nav>
          )}
        </div>

        {/* Language Switcher and Mobile Toggle */}
        <div className="nav-right-group">
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

          <button
            className="nav-mobile-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="nav-mobile-drawer">
          <ul className="nav-mobile-links">
            {navLinks.map((link) => {
              const isActive = isContactPage
                ? link.id === "contact"
                : activeSection === link.id;

              return (
                <li key={link.id}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      onClick={() => {
                        setActiveSection(link.id);
                        setMenuOpen(false);
                      }}
                      className={
                        isActive ? "mobile-active" : ""
                      }
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(event) => {
                        handleNavClick(event, link);
                        setMenuOpen(false);
                      }}
                      className={
                        isActive ? "mobile-active" : ""
                      }
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
                  <span className="nav-user-avatar">
                    {userInitials}
                  </span>

                  <div className="mobile-user-info">
                    <p className="mobile-user-name">
                      {displayName}
                    </p>

                    <p className="mobile-user-email">
                      {currentUser.email}
                    </p>
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
                    <span>
                      {nav.switchAccount ||
                        (language === "ar"
                          ? "استخدام حساب آخر"
                          : "Use Another Account")}
                    </span>
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
                    <span>
                      {nav.logOut ||
                        (language === "ar"
                          ? "تسجيل الخروج"
                          : "Log Out")}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-btns">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="mobile-login-link"
                >
                  {nav.login}
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="mobile-signup-link"
                >
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
