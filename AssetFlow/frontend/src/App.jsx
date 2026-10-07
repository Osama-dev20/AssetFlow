import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/auth/ToastContainer';
import { SSOModal } from './components/auth/SSOModal';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';

import Navbar from './components/sections/Navbar/Navbar';
import Hero from './components/sections/Hero/Hero';
import AboutProduct from './components/sections/AboutProduct/AboutProduct';
import Audience from './components/sections/Audience/Audience';
import HowItWorks from './components/sections/HowItWorks/HowItWorks';
import Footer from './components/sections/Footer/Footer';
import { ContactPage } from './components/contact/ContactPage';
import { RevealOnScroll } from './components/common/RevealOnScroll';

function LandingPage() {
  return (
    <>
      <Navbar />

      <Hero />

      <div className="section-divider" />

      <RevealOnScroll>
        <AboutProduct />
      </RevealOnScroll>

      <div className="section-divider" />

      <RevealOnScroll>
        <Audience />
      </RevealOnScroll>

      <div className="section-divider" />

      <RevealOnScroll>
        <HowItWorks />
      </RevealOnScroll>

      <Footer />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
      <SSOModal />
      <ForgotPasswordModal />
    </AppProvider>
  );
}

export default App;
