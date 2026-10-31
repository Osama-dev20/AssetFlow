import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Bell, Menu, ChevronDown, Check, 
  AlertTriangle, ShieldAlert, Wrench, LogOut, Globe, Sparkles,
  Volume2, VolumeX, User, Shield, AlertOctagon
} from 'lucide-react';
import { soundManager } from '../lib/soundEffects';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { 
    setIsCommandPaletteOpen, 
    currentUser, 
    setCurrentUser, 
    teamMembers, 
    setCurrentPage, 
    showToast,
    workOrders,
    services,
    language,
    setLanguage,
    isSoundMuted,
    toggleSoundMute,
    setActiveAccessError,
    switchRole
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    const next = language === 'ar' ? 'en' : 'ar';
    setLanguage(next);
    showToast(
      next === 'en' ? 'Language switched to English' : 'تم تفعيل اللغة العربية',
      next === 'en' ? 'Full interface preview in EN mode' : 'الواجهة كاملة باللغة العربية',
      'info'
    );
  };

  const notifications = language === 'en' ? [
    {
      id: 'n1',
      title: 'Critical fault impacting vital service!',
      message: 'Centrifugal Pump #2 is under maintenance, RO loop has no standby',
      time: '15 mins ago',
      type: 'critical',
      icon: ShieldAlert
    },
    {
      id: 'n2',
      title: 'Overdue Preventive Maintenance',
      message: 'Turbine Generator 1500kVA overdue by 2 days',
      time: '2 hours ago',
      type: 'warning',
      icon: AlertTriangle
    },
    {
      id: 'n3',
      title: 'Work Order WO-849 Updated',
      message: 'Ahmed Khalil started disassembling mechanical seal',
      time: '3 hours ago',
      type: 'info',
      icon: Wrench
    }
  ] : [
    {
      id: 'n1',
      title: 'عطل حرج يؤثر على خدمة حيوية!',
      message: 'مضخة الطرد المركزي #2 تحت الصيانة وتزويد التحلية بلا بديل',
      time: 'منذ 15 دقيقة',
      type: 'critical',
      icon: ShieldAlert
    },
    {
      id: 'n2',
      title: 'صيانة وقائية متأخرة',
      message: 'المولد التوربيني 1500kVA تجاوز موعد الفحص بـ يومين',
      time: 'منذ ساعتين',
      type: 'warning',
      icon: AlertTriangle
    },
    {
      id: 'n3',
      title: 'تم تحديث أمر العمل WO-849',
      message: 'قام أحمد خليل بالبدء بفك الجوان الميكانيكي',
      time: 'منذ 3 ساعات',
      type: 'info',
      icon: Wrench
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#0B1222]/85 backdrop-blur-xl border-b border-[#1A2440] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Right/Left side: Mobile Menu + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => {
            soundManager.playButtonClick();
            onToggleSidebar();
          }}
          className="lg:hidden p-2.5 rounded-xl border border-[#22304D] bg-[#0F1729] text-[#C3CEDF] hover:text-white cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Trigger */}
        <button
          onClick={() => {
            soundManager.playButtonClick();
            setIsCommandPaletteOpen(true);
          }}
          className="flex-1 flex items-center justify-between gap-3 h-11 px-3.5 rounded-xl border border-[#22304D] bg-[#0F1729] text-[#8696AE] hover:border-blue-500/50 hover:text-[#C3CEDF] transition-all text-sm group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search size={17} className="text-[#8696AE] group-hover:text-blue-400 transition-colors shrink-0" />
            <span className="truncate text-xs sm:text-sm">
              {language === 'en' ? 'Search assets, codes, sites, or work orders...' : 'ابحث عن أصل، كود، موقع، أو أمر عمل...'}
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 mono text-[11px] px-2 py-0.5 rounded bg-[#16213A] border border-[#26324A] text-[#C3CEDF]">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Left side: Notification Center + Language + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <button
          onClick={() => {
            soundManager.playButtonClick();
            toggleLanguage();
          }}
          className="h-10 px-3.5 rounded-xl border border-[#22304D] bg-[#0F1729] text-xs font-bold text-[#C3CEDF] hover:text-white hover:border-[#3B82F6] transition-all flex items-center justify-center gap-2 mono cursor-pointer shadow-sm shrink-0"
          title={language === 'en' ? 'Switch to Arabic' : 'تغيير لغة العرض إلى الإنجليزية'}
        >
          <Globe size={15} className="text-blue-400 shrink-0" />
          <span className="uppercase tracking-wider">{language.toUpperCase()}</span>
        </button>

        {/* Global Sound Effects Toggle */}
        <button
          onClick={() => {
            const nextMuted = toggleSoundMute();
            if (!nextMuted) {
              soundManager.playButtonClick();
            }
            showToast(
              nextMuted 
                ? (language === 'ar' ? 'تم كتم المؤثرات الصوتية' : 'Sound effects muted')
                : (language === 'ar' ? 'تم تفعيل المؤثرات الصوتية' : 'Sound effects enabled'),
              nextMuted 
                ? (language === 'ar' ? 'الصوت صامت الآن' : 'Audio is now silent') 
                : (language === 'ar' ? 'نغمات التفاعل نشطة' : 'Interactive audio active'),
              'info'
            );
          }}
          className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
            isSoundMuted 
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' 
              : 'border-[#22304D] bg-[#0F1729] text-[#C3CEDF] hover:text-white hover:border-[#3B82F6]'
          }`}
          title={isSoundMuted ? (language === 'ar' ? 'تفعيل الصوت' : 'Unmute audio') : (language === 'ar' ? 'كتم الصوت' : 'Mute audio')}
          aria-label="Toggle Sound"
        >
          {isSoundMuted ? <VolumeX size={17} /> : <Volume2 size={17} className="text-teal-400" />}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              soundManager.playCardSwitch();
              setIsNotifOpen((prev) => !prev);
            }}
            className="w-10 h-10 rounded-xl border border-[#22304D] bg-[#0F1729] text-[#C3CEDF] hover:text-white hover:border-[#3B82F6] transition-all flex items-center justify-center relative cursor-pointer"
            aria-label={language === 'en' ? 'Notifications' : 'الإشعارات'}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-[#0F1729] pulse-critical" />
            )}
          </button>

          {/* Notifications Flyout */}
          {isNotifOpen && (
            <div className={`absolute ${language === 'en' ? 'right-0 text-left' : 'left-0 sm:right-auto sm:left-0 text-right'} mt-2 w-80 sm:w-96 rounded-2xl bg-[#0F1729] border border-[#26324A] shadow-2xl p-4 flex flex-col gap-3 z-50 animate-slide-up`}>
              <div className="flex items-center justify-between pb-2 border-b border-[#1E2A44]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{language === 'en' ? 'Live Notifications' : 'الإشعارات الحية'}</span>
                  {unreadCount > 0 && (
                    <span className="text-xs mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold">
                      {unreadCount} {language === 'en' ? 'new' : 'جديدة'}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      setUnreadCount(0);
                      showToast(language === 'en' ? 'All notifications marked as read' : 'تم تعليم جميع الإشعارات كمقروءة', '', 'info');
                    }}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    {language === 'en' ? 'Mark all as read' : 'تحديد كـ مقروء'}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        setIsNotifOpen(false);
                        if (n.type === 'critical') setCurrentPage('work-orders');
                        else if (n.type === 'warning') setCurrentPage('preventive');
                        else setCurrentPage('work-orders');
                      }}
                      className={`p-2.5 rounded-xl hover:bg-[#16213A] transition-colors cursor-pointer flex gap-3 ${language === 'en' ? 'text-left' : 'text-right'}`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        n.type === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                        n.type === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white leading-tight">{n.title}</div>
                        <div className="text-[11px] text-[#A3B1C6] mt-0.5 leading-snug">{n.message}</div>
                        <div className="text-[10px] text-[#8696AE] mt-1 mono">{n.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setIsNotifOpen(false);
                  setCurrentPage('audit');
                }}
                className="w-full py-2 text-center text-xs text-[#93C5FD] hover:text-white bg-[#16213A]/60 rounded-xl hover:bg-[#16213A] transition-colors cursor-pointer"
              >
                {language === 'en' ? 'View Full Audit & Notification Log →' : 'عرض سجل التدقيق والإشعارات الكامل ←'}
              </button>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 h-10 px-2 sm:px-3 rounded-xl border border-[#22304D] bg-[#0F1729] text-[#E6EDF7] hover:border-[#3B82F6] transition-all cursor-pointer"
          >
            <span className={`w-7 h-7 rounded-lg bg-gradient-to-br ${currentUser.avatarGradient} text-white font-bold text-xs flex items-center justify-center shadow-sm`}>
              {language === 'en' ? (currentUser.initials === 'ط' ? 'TN' : currentUser.initials) : currentUser.initials}
            </span>
            <div className={`hidden sm:block leading-tight ${language === 'en' ? 'text-left' : 'text-right'}`}>
              <span className="block text-xs font-bold text-white">{language === 'en' ? (currentUser.nameEn || 'Tariq Al-Nabulsi') : currentUser.name}</span>
              <span className="block text-[10px] text-[#8696AE]">
                {language === 'en' ? (currentUser.roleEn || (currentUser.role === 'admin' ? 'Facility Director' : currentUser.role === 'technician' ? 'Field Technician' : currentUser.role === 'operations' ? 'Operations Eng.' : 'Reporter')) : currentUser.roleArabic}
              </span>
            </div>
            <ChevronDown size={14} className="text-[#8696AE]" />
          </button>

          {/* User Profile Dropdown */}
          {isUserMenuOpen && (
            <div className={`absolute ${language === 'en' ? 'right-0 text-left font-sans' : 'left-0 text-right font-arabic'} mt-2 w-72 rounded-2xl bg-[#0F1729] border border-[#26324A] shadow-2xl p-3 flex flex-col gap-2.5 z-50 animate-slide-up`}>
              <div className="p-2 border-b border-[#1E2A44]">
                <div className="font-bold text-sm text-white">{language === 'en' ? (currentUser.nameEn || 'Tariq Al-Nabulsi') : currentUser.name}</div>
                <div className="text-xs text-blue-400 font-medium">
                  {language === 'en' ? (currentUser.roleEn || (currentUser.role === 'admin' ? 'Facility Director' : currentUser.role === 'technician' ? 'Field Technician' : currentUser.role === 'operations' ? 'Operations Eng.' : 'Reporter')) : currentUser.roleArabic}
                </div>
                <div className="text-xs text-[#8696AE] mono mt-0.5">{currentUser.email}</div>
              </div>

              {/* Direct Link to Profile */}
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setIsUserMenuOpen(false);
                  setCurrentPage('profile');
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl text-xs bg-[#16213A]/50 hover:bg-[#16213A] text-white font-medium transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <User size={15} className="text-blue-400" />
                  <span>{language === 'en' ? 'My Profile & Permissions' : 'ملفي الشخصي وصلاحياتي'}</span>
                </div>
                <span className="text-[10px] mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase">
                  {currentUser.role}
                </span>
              </button>

              {/* Fast Role Switcher (Sprint 2/3) */}
              <div className="pt-2 border-t border-[#1E2A44]">
                <span className="text-[11px] font-semibold text-[#8696AE] px-1 block mb-1.5">
                  {language === 'en' ? 'Fast Role Switch:' : 'التبديل السريع للأدوار:'}
                </span>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => {
                      soundManager.playButtonClick();
                      switchRole('admin');
                      setIsUserMenuOpen(false);
                      showToast(
                        language === 'en' ? 'Switched to Admin Role' : 'تم التحويل إلى دور المدير',
                        'Tariq Al-Nabulsi · Facility Director',
                        'info'
                      );
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
                      currentUser.role === 'admin'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-[#16213A] text-[#A3B1C6] hover:text-white'
                    }`}
                  >
                    {language === 'en' ? 'Admin' : 'مدير'}
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playButtonClick();
                      switchRole('technician');
                      setIsUserMenuOpen(false);
                      showToast(
                        language === 'en' ? 'Switched to Technician Role' : 'تم التحويل إلى دور الفني',
                        'Ahmed Khalil · Senior Field Technician',
                        'info'
                      );
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
                      currentUser.role === 'technician'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-[#16213A] text-[#A3B1C6] hover:text-white'
                    }`}
                  >
                    {language === 'en' ? 'Tech' : 'فني'}
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playButtonClick();
                      switchRole('reporter');
                      setIsUserMenuOpen(false);
                      showToast(
                        language === 'en' ? 'Switched to Reporter Role' : 'تم التحويل إلى دور المُبلّغ',
                        'Hiba Yaish · Operations Reporter',
                        'info'
                      );
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
                      currentUser.role === 'reporter'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-[#16213A] text-[#A3B1C6] hover:text-white'
                    }`}
                  >
                    {language === 'en' ? 'Reporter' : 'مُبلّغ'}
                  </button>
                </div>
              </div>

              {/* HTTP Error Simulation (QA Sprint 2) */}
              <div className="pt-2 border-t border-[#1E2A44]">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#8696AE] px-1 mb-1.5">
                  <span>{language === 'en' ? 'HTTP Error Simulation (QA):' : 'محاكاة أخطاء الوصول (QA):'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      soundManager.playButtonClick();
                      setIsUserMenuOpen(false);
                      setActiveAccessError(401);
                    }}
                    className="px-2 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] mono font-bold text-center cursor-pointer transition-colors"
                    title={language === 'en' ? '401 Unauthorized / Session Expired' : '401 غير مخول / انتهاء الجلسة'}
                  >
                    401
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playButtonClick();
                      setIsUserMenuOpen(false);
                      setActiveAccessError(403);
                    }}
                    className="px-2 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] mono font-bold text-center cursor-pointer transition-colors"
                    title={language === 'en' ? '403 Forbidden / Insufficient Permissions' : '403 محظور / صلاحية غير كافية'}
                  >
                    403
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playButtonClick();
                      setIsUserMenuOpen(false);
                      setActiveAccessError(404);
                    }}
                    className="px-2 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] mono font-bold text-center cursor-pointer transition-colors"
                    title={language === 'en' ? '404 Not Found' : '404 غير موجود'}
                  >
                    404
                  </button>
                </div>
              </div>

              {/* Demo Persona Switcher */}
              <div className="pt-2 border-t border-[#1E2A44]">
                <span className="text-[11px] font-semibold text-[#8696AE] px-1 block mb-1">
                  {language === 'en' ? 'Specific Member Switch:' : 'التبديل إلى عضو محدد:'}
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setCurrentUser(member);
                        setIsUserMenuOpen(false);
                        showToast(
                          language === 'en' ? `Switched to: ${member.nameEn || member.name}` : `تم التبديل إلى: ${member.name}`, 
                          language === 'en' ? (member.roleEn || member.role) : member.roleArabic, 
                          'info'
                        );
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        currentUser.id === member.id ? 'bg-[#16213A] text-white font-semibold' : 'text-[#C3CEDF] hover:bg-[#121C33]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${member.avatarGradient} text-white text-[10px] flex items-center justify-center`}>
                          {language === 'en' ? member.initials : member.initials}
                        </span>
                        <span className="truncate max-w-[100px]">{language === 'en' ? (member.nameEn || member.name) : member.name}</span>
                      </div>
                      <span className="text-[10px] text-[#8696AE]">
                        {language === 'en' ? (member.roleEn || member.role) : member.roleArabic}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#1E2A44] pt-2">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setCurrentPage('landing');
                    showToast(
                      language === 'en' ? 'Signed out' : 'تم تسجيل الخروج', 
                      language === 'en' ? 'Redirected to landing page' : 'تم الانتقال للصفحة الرئيسية', 
                      'info'
                    );
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>{language === 'en' ? 'Sign out to Landing' : 'تسجيل الخروج والانتقال للمقدمة'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
