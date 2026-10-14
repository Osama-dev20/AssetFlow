import React, { useState, useEffect, lazy, Suspense } from 'react';
import './App.css';
import { AppRoutes } from './router';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/auth/ToastContainer';
import { SSOModal } from './components/auth/SSOModal';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { useLocation } from 'react-router-dom';
import { RevealOnScroll } from './components/common/RevealOnScroll';
import { ScrollToTop } from './components/common/ScrollToTop';
import { HorizonHeroSection } from './components/ui/horizon-hero-section';

// Lazy-loaded landing page sections with prefetch capability
const Navbar = lazy(() => import('./components/sections/Navbar/Navbar'));
const Hero = lazy(() => import('./components/sections/Hero/Hero'));
const AboutProduct = lazy(() => import('./components/sections/AboutProduct/AboutProduct'));
const Audience = lazy(() => import('./components/sections/Audience/Audience'));
const HowItWorks = lazy(() =>
  import('./components/sections/HowItWorks/HowItWorks').then((m) => ({ default: m.HowItWorks }))
);
const Footer = lazy(() => import('./components/sections/Footer/Footer'));
const ServicesWheelSection = lazy(() =>
  import('./components/sections/ServicesWheel/ServicesWheelSection').then((m) => ({
    default: m.ServicesWheelSection,
  }))
);

function LandingPage() {
  const location = useLocation();
  // On page refresh, ALWAYS show the intro presentation!
  // Only skip if explicitly asked via location.state?.skipIntro (e.g. from dashboard Website button)
  const [hasEnteredSite, setHasEnteredSite] = useState(() => {
    return Boolean(location.state?.skipIntro);
  });

  // Prefetch main landing sections during browser idle time while user enjoys intro
  useEffect(() => {
    if (!hasEnteredSite && typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(() => {
        import('./components/sections/Navbar/Navbar');
        import('./components/sections/Hero/Hero');
        import('./components/sections/AboutProduct/AboutProduct');
      });
      return () => {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(handle);
        }
      };
    }
  }, [hasEnteredSite]);

  const handleEnterSite = () => {
    setHasEnteredSite(true);
    document.body.style.overflow = "";

    // Automatically transition to the hero section (#home)
    setTimeout(() => {
      const heroEl = document.getElementById("home");
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 60);
  };

  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.slice(1);
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          const headerOffset = 85;
          const targetY = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }, 180);
      }
    }
  }, [hasEnteredSite]);

  return (
    <>
      {!hasEnteredSite && (
        <HorizonHeroSection onEnterSite={handleEnterSite} />
      )}

      {hasEnteredSite && (
        <Suspense
          fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
          }
        >
          <Navbar />
          <Hero />
          <div className="section-divider" />
          <AboutProduct />
          <div className="section-divider" />
          <RevealOnScroll>
            <ServicesWheelSection />
          </RevealOnScroll>
          <div className="section-divider" />
          <RevealOnScroll>
            <Audience />
          </RevealOnScroll>
          <div className="section-divider" />
          <HowItWorks />
          <Footer />
        </Suspense>
      )}
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <ScrollToTop />
      <ToastContainer />
      <AppRoutes LandingPage={LandingPage} />
      <SSOModal />
      <ForgotPasswordModal />
    </AppProvider>
  );
}

export default App;
