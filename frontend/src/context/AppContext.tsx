import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, UserSession, ToastMessage } from '../types';
import { translations } from '../locales/translations';
import { DEMO_ACCOUNTS } from '../data/mockData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations['ar'];
  currentPage: 'login' | 'signup';
  setCurrentPage: (page: 'login' | 'signup') => void;
  currentUser: UserSession | null;
  setCurrentUser: (user: UserSession | null) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  isSSOModalOpen: boolean;
  setIsSSOModalOpen: (open: boolean) => void;
  isForgotPasswordModalOpen: boolean;
  setIsForgotPasswordModalOpen: (open: boolean) => void;
  activeSlide: number;
  setActiveSlide: (index: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('af_language');
      return (stored === 'ar' || stored === 'en') ? stored : 'ar';
    } catch {
      return 'ar';
    }
  });

  const [currentPage, setCurrentPage] = useState<'login' | 'signup'>('login');

  const [currentUser, setCurrentUserState] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem('af_user_session');
      if (stored) return JSON.parse(stored);
      // Default to demo admin account for smooth evaluation
      const demo = DEMO_ACCOUNTS[0];
      return {
        id: 'usr_admin_default',
        fullName: demo.name,
        email: demo.email,
        role: demo.role,
        status: demo.status,
        organizationName: demo.organization,
      };
    } catch {
      return null;
    }
  });

  const setCurrentUser = (user: UserSession | null) => {
    setCurrentUserState(user);
    try {
      if (user) {
        localStorage.setItem('af_user_session', JSON.stringify(user));
      } else {
        localStorage.removeItem('af_user_session');
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSSOModalOpen, setIsSSOModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Background slide rotation - only active when auth modal or auth pages are active
  useEffect(() => {
    const isAuthActive =
      isSSOModalOpen ||
      isForgotPasswordModalOpen ||
      (typeof window !== 'undefined' &&
        (window.location.pathname.startsWith('/login') ||
          window.location.pathname.startsWith('/signup')));

    if (!isAuthActive) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 5);
    }, 6000);
    return () => clearInterval(timer);
  }, [isSSOModalOpen, isForgotPasswordModalOpen]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('af_language', lang);
    } catch {}
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [newToast, ...prev]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const t = translations[language];

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      currentPage,
      setCurrentPage,
      currentUser,
      setCurrentUser,
      toasts,
      addToast,
      removeToast,
      isSSOModalOpen,
      setIsSSOModalOpen,
      isForgotPasswordModalOpen,
      setIsForgotPasswordModalOpen,
      activeSlide,
      setActiveSlide,
    }),
    [
      language,
      t,
      currentPage,
      currentUser,
      toasts,
      isSSOModalOpen,
      isForgotPasswordModalOpen,
      activeSlide,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
