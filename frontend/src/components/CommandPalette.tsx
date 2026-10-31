import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Wrench, ShieldAlert, Cpu, Building2, 
  Calendar, Users, BarChart3, Settings, ArrowLeft 
} from 'lucide-react';
import { AppPage } from '../types';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setCurrentPage, 
    assets, 
    workOrders, 
    openAssetDetail,
    language 
  } = useApp();
  const isEn = language === 'en';
  
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
    setIsCommandPaletteOpen(false);
  };

  const filteredAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      (a.nameEn && a.nameEn.toLowerCase().includes(query.toLowerCase())) ||
      a.code.toLowerCase().includes(query.toLowerCase()) ||
      a.siteName.toLowerCase().includes(query.toLowerCase()) ||
      (a.siteNameEn && a.siteNameEn.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredOrders = workOrders.filter(
    (w) =>
      w.title.toLowerCase().includes(query.toLowerCase()) ||
      (w.titleEn && w.titleEn.toLowerCase().includes(query.toLowerCase())) ||
      w.code.toLowerCase().includes(query.toLowerCase()) ||
      w.assetName.toLowerCase().includes(query.toLowerCase()) ||
      (w.assetNameEn && w.assetNameEn.toLowerCase().includes(query.toLowerCase()))
  );

  const pagesList: { title: string; titleEn: string; page: AppPage; icon: any }[] = [
    { title: 'لوحة القيادة والمؤشرات الرئيسية', titleEn: 'Dashboard & Main KPIs', page: 'dashboard', icon: BarChart3 },
    { title: 'سجل الأصول والمعدات', titleEn: 'Asset Inventory & Registry', page: 'assets', icon: Cpu },
    { title: 'أوامر العمل ولوحة كانبان', titleEn: 'Work Orders & Kanban Board', page: 'work-orders', icon: Wrench },
    { title: 'مصفوفة الخدمات الحرجة ومحاكي الأعطال', titleEn: 'Critical Services & Failure Simulator', page: 'services', icon: ShieldAlert },
    { title: 'الصيانة الوقائية والتقويم', titleEn: 'Preventive Maintenance & Schedule', page: 'preventive', icon: Calendar },
    { title: 'المواقع والمنشآت', titleEn: 'Sites & Facilities', page: 'sites', icon: Building2 },
    { title: 'الفريق والصلاحيات', titleEn: 'Team & Role Permissions', page: 'team', icon: Users },
    { title: 'التحليلات والتقارير', titleEn: 'Analytics & SLA Reports', page: 'reports', icon: BarChart3 },
    { title: 'إعدادات المنظومة ونموذج الأولوية', titleEn: 'System Settings & Priority Model', page: 'settings', icon: Settings },
  ];

  const filteredPages = pagesList.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.titleEn.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#070B16]/80 backdrop-blur-md animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsCommandPaletteOpen(false)} 
      />

      <div className={`relative w-full max-w-2xl bg-[#0F1729] border border-[#26324A] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 max-h-[80vh] ${
        isEn ? 'text-left font-sans' : 'text-right font-arabic'
      }`}>
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1E2A44] bg-[#0B1222]">
          <Search size={20} className="text-[#8696AE] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isEn
                ? 'Search equipment, code, work order, critical service, or jump to page...'
                : 'ابحث عن أصل، كود، أمر عمل، خدمة حرجة، أو انتقل لصفحة...'
            }
            className={`flex-1 bg-transparent text-white text-base placeholder-[#8696AE] focus:outline-none ${
              isEn ? 'text-left' : 'text-right'
            }`}
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="text-xs px-2 py-1 bg-[#16213A] border border-[#26324A] rounded-md text-[#A3B1C6] hover:text-white mono cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-3 divide-y divide-[#1A2440]/60 space-y-3">
          {/* Work Orders */}
          {filteredOrders.length > 0 && (
            <div className="pt-2">
              <div className="text-xs font-semibold text-[#8696AE] px-3 mb-1.5">
                {isEn ? 'Work Orders' : 'أوامر العمل'}
              </div>
              <div className="space-y-1">
                {filteredOrders.slice(0, 3).map((wo) => {
                  const woTitle = isEn ? (wo.titleEn || wo.title) : wo.title;
                  const woAsset = isEn ? (wo.assetNameEn || wo.assetName) : wo.assetName;

                  return (
                    <button
                      key={wo.id}
                      onClick={() => {
                        navigateTo('work-orders');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#16213A] transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                          <Wrench size={16} />
                        </span>
                        <div className="truncate">
                          <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                            {woTitle}
                          </div>
                          <div className="text-xs text-[#8696AE] flex items-center gap-2">
                            <span className="mono text-blue-400">{wo.code}</span>
                            <span>•</span>
                            <span>{woAsset}</span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span className="text-xs mono px-2 py-0.5 rounded bg-[#16213A] border border-[#26324A] text-rose-300">
                          {isEn ? `Score ${wo.priorityScore}` : `أولوية ${wo.priorityScore}`}
                        </span>
                        <ArrowLeft size={16} className={`text-[#8696AE] ${isEn ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:translate-x-[-2px]'} transition-transform`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assets */}
          {filteredAssets.length > 0 && (
            <div className="pt-2">
              <div className="text-xs font-semibold text-[#8696AE] px-3 mb-1.5">
                {isEn ? 'Assets & Equipment' : 'الأصول والمعدات'}
              </div>
              <div className="space-y-1">
                {filteredAssets.slice(0, 4).map((asset) => {
                  const aName = isEn ? (asset.nameEn || asset.name) : asset.name;
                  const aSite = isEn ? (asset.siteNameEn || asset.siteName) : asset.siteName;

                  return (
                    <button
                      key={asset.id}
                      onClick={() => {
                        openAssetDetail(asset.id);
                        setIsCommandPaletteOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#16213A] transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                          <Cpu size={16} />
                        </span>
                        <div className="truncate">
                          <div className="text-sm font-medium text-white group-hover:text-teal-400 transition-colors truncate">
                            {aName}
                          </div>
                          <div className="text-xs text-[#8696AE] flex items-center gap-2">
                            <span className="mono text-teal-400">{asset.code}</span>
                            <span>•</span>
                            <span>{aSite}</span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          asset.status === 'operational' ? 'bg-emerald-500/10 text-emerald-400' :
                          asset.status === 'maintenance' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {asset.status === 'operational'
                            ? (isEn ? 'Operational' : 'يعمل')
                            : asset.status === 'maintenance'
                            ? (isEn ? 'Maintenance' : 'تحت الصيانة')
                            : (isEn ? 'Stopped' : 'متوقف')}
                        </span>
                        <ArrowLeft size={16} className={`text-[#8696AE] ${isEn ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:translate-x-[-2px]'} transition-transform`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Pages */}
          {filteredPages.length > 0 && (
            <div className="pt-2">
              <div className="text-xs font-semibold text-[#8696AE] px-3 mb-1.5">
                {isEn ? 'Quick Navigation' : 'الانتقال السريع'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {filteredPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.page}
                      onClick={() => navigateTo(page.page)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#16213A] transition-colors group cursor-pointer"
                    >
                      <span className="w-7 h-7 rounded-lg bg-[#1E2A44] text-[#A3B1C6] flex items-center justify-center shrink-0 group-hover:text-white group-hover:bg-blue-600/30 transition-colors">
                        <Icon size={14} />
                      </span>
                      <span className="text-xs text-[#C3CEDF] group-hover:text-white truncate">
                        {isEn ? page.titleEn : page.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredAssets.length === 0 && filteredOrders.length === 0 && filteredPages.length === 0 && (
            <div className="py-12 text-center text-[#8696AE] text-sm">
              {isEn ? `No results found for "${query}"` : `لا توجد نتائج مطابقة لـ "${query}"`}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-[#1E2A44] bg-[#0B1222] text-xs text-[#8696AE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              {isEn ? 'Use ' : 'استخدم '}
              <kbd className="mono bg-[#16213A] px-1.5 py-0.5 rounded border border-[#26324A] text-white">↑</kbd> <kbd className="mono bg-[#16213A] px-1.5 py-0.5 rounded border border-[#26324A] text-white">↓</kbd> 
              {isEn ? ' to navigate' : ' للتنقل'}
            </span>
            <span>
              <kbd className="mono bg-[#16213A] px-1.5 py-0.5 rounded border border-[#26324A] text-white">Enter</kbd> 
              {isEn ? ' to select' : ' للاختيار'}
            </span>
          </div>
          <span className="text-blue-400 font-medium">AssetFlow Search AI</span>
        </div>
      </div>
    </div>
  );
};
