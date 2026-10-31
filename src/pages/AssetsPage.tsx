import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, Search, LayoutGrid, Table as TableIcon, Filter, 
  ArrowLeft, ArrowRight, Cpu, ShieldAlert, CheckCircle2, Clock, 
  AlertTriangle, Wrench, MoreVertical, QrCode 
} from 'lucide-react';
import { AssetStatus } from '../types';
import { AddAssetDrawer } from '../components/AddAssetDrawer';

export const AssetsPage: React.FC = () => {
  const { assets, openAssetDetail, sites, services, setCurrentPage, language } = useApp();
  
  const isEn = language === 'en';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AssetStatus>('all');
  const [siteFilter, setSiteFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  // Filtered Assets
  const filteredAssets = assets.filter((asset) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = asset.name.toLowerCase().includes(q) || (asset.nameEn && asset.nameEn.toLowerCase().includes(q));
    const codeMatch = asset.code.toLowerCase().includes(q);
    const siteMatch = asset.siteName.toLowerCase().includes(q) || (asset.siteNameEn && asset.siteNameEn.toLowerCase().includes(q));
    const matchesSearch = nameMatch || codeMatch || siteMatch;
    
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    const matchesSite = siteFilter === 'all' || asset.siteId === siteFilter;

    return matchesSearch && matchesStatus && matchesSite;
  });

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full ${isEn ? 'text-left font-sans' : 'text-right font-arabic'}`}>
      {/* Top Title & Header Actions */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isEn ? 'Asset & Machinery Registry' : 'سجل الأصول والمعدات'}
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
            {isEn 
              ? 'Manage all vital pumps, generators, and infrastructure, tracking linkage to critical services.' 
              : 'إدارة كافة المضخات، المولدات، والمعدات الحيوية وتتبع ارتباطها بالخدمات الحرجة.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddDrawerOpen(true)}
          className="h-11 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>{isEn ? 'Register New Asset' : 'تسجيل أصل جديد'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0F1729] border border-[#1E2A44] flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search by name, code (AST-...), or site...' : 'ابحث بالاسم، الكود (AST-...)، أو الموقع...'}
            className={`w-full h-10 px-3.5 ${isEn ? 'pl-10 text-left' : 'pl-10 text-right'} rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none placeholder-[#8696AE]`}
          />
          <Search size={16} className={`absolute ${isEn ? 'left-3' : 'left-3'} top-3 text-[#8696AE]`} />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-10 px-3 rounded-xl bg-[#0B1222] border border-[#26324A] text-[#C3CEDF] text-xs focus:outline-none cursor-pointer"
          >
            <option value="all">{isEn ? 'All Statuses' : 'كل الحالات التشغيلية'}</option>
            <option value="operational">{isEn ? 'Operational' : 'يعمل بكفاءة'}</option>
            <option value="maintenance">{isEn ? 'Maintenance' : 'تحت الصيانة'}</option>
            <option value="stopped">{isEn ? 'Stopped / Critical' : 'متوقف / عطل حرج'}</option>
          </select>

          {/* Site Filter */}
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#0B1222] border border-[#26324A] text-[#C3CEDF] text-xs focus:outline-none cursor-pointer"
          >
            <option value="all">{isEn ? 'All Sites & Facilities' : 'كل المواقع والمنشآت'}</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {isEn ? (s.nameEn || s.name) : s.name}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#0B1222] border border-[#26324A]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
              }`}
              title={isEn ? 'Table View' : 'عرض الجدول'}
            >
              <TableIcon size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
              }`}
              title={isEn ? 'Grid View' : 'عرض البطاقات'}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="rounded-2xl bg-[#0F1729] border border-[#1E2A44] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className={`w-full ${isEn ? 'text-left' : 'text-right'} border-collapse`}>
              <thead>
                <tr className="bg-[#0B1222] border-b border-[#1E2A44] text-[11px] font-bold text-[#8696AE]">
                  <th className="py-3.5 px-4">{isEn ? 'Asset Code' : 'كود الأصل'}</th>
                  <th className="py-3.5 px-4">{isEn ? 'Asset Name & Category' : 'اسم الأصل والتصنيف'}</th>
                  <th className="py-3.5 px-4">{isEn ? 'Site' : 'الموقع'}</th>
                  <th className="py-3.5 px-4">{isEn ? 'Operating Status' : 'الحالة التشغيلية'}</th>
                  <th className="py-3.5 px-4">{isEn ? 'Critical Service' : 'الخدمة الحرجة المدعومة'}</th>
                  <th className="py-3.5 px-4">{isEn ? 'Priority Score' : 'الأولوية المحسوبة'}</th>
                  <th className="py-3.5 px-4 text-center">{isEn ? 'Actions' : 'الإجراءات'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2440]/70 text-xs sm:text-sm">
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => openAssetDetail(asset.id)}
                    className="hover:bg-[#121C33] transition-colors cursor-pointer group"
                  >
                    {/* Code */}
                    <td className="py-4 px-4 font-bold text-blue-400 mono">
                      {asset.code}
                    </td>

                    {/* Name & Category */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                        {isEn ? (asset.nameEn || asset.name) : asset.name}
                      </div>
                      <div className="text-xs text-[#8696AE] mt-0.5">
                        {isEn ? (asset.categoryEn || asset.category) : asset.category} • {asset.model}
                      </div>
                    </td>

                    {/* Site */}
                    <td className="py-4 px-4 text-[#C3CEDF]">
                      {isEn ? (asset.siteNameEn || asset.siteName) : asset.siteName}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        asset.status === 'operational'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                          : asset.status === 'maintenance'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          asset.status === 'operational' ? 'bg-emerald-400' :
                          asset.status === 'maintenance' ? 'bg-amber-400' : 'bg-rose-400'
                        }`} />
                        {asset.status === 'operational' 
                          ? (isEn ? 'Operational' : 'يعمل') 
                          : asset.status === 'maintenance' 
                          ? (isEn ? 'Maintenance' : 'تحت الصيانة') 
                          : (isEn ? 'Stopped' : 'متوقف')}
                      </span>
                    </td>

                    {/* Critical Service */}
                    <td className="py-4 px-4">
                      {(asset.criticalServiceName || asset.criticalServiceNameEn) ? (
                        <div className="flex items-center gap-1.5 text-xs text-white">
                          <ShieldAlert size={14} className={asset.hasBackup ? 'text-blue-400' : 'text-rose-400'} />
                          <span className="font-medium truncate max-w-[180px]">
                            {isEn ? (asset.criticalServiceNameEn || asset.criticalServiceName) : asset.criticalServiceName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#8696AE]">{isEn ? 'Unlinked' : 'غير مرتبط'}</span>
                      )}
                    </td>

                    {/* Priority Score */}
                    <td className="py-4 px-4">
                      <span className={`text-xs mono font-bold px-2.5 py-1 rounded-lg border ${
                        asset.priorityScore >= 75
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                          : asset.priorityScore >= 50
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                          : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                      }`}>
                        {asset.priorityScore}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openAssetDetail(asset.id)}
                          className="p-1.5 rounded-lg text-[#8696AE] hover:text-white hover:bg-[#16213A] transition-colors cursor-pointer"
                          title={isEn ? 'View Full Details' : 'عرض التفاصيل الكاملة'}
                        >
                          {isEn ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => openAssetDetail(asset.id)}
              className="p-5 rounded-2xl bg-[#0F1729] border border-[#1E2A44] hover:border-blue-500/40 transition-all cursor-pointer flex flex-col justify-between gap-4 card-glow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="mono font-bold text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {asset.code}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    asset.status === 'operational' ? 'bg-emerald-500/15 text-emerald-400' :
                    asset.status === 'maintenance' ? 'bg-amber-500/15 text-amber-400' : 'bg-rose-500/15 text-rose-400'
                  }`}>
                    {asset.status === 'operational' 
                      ? (isEn ? 'Operational' : 'يعمل') 
                      : asset.status === 'maintenance' 
                      ? (isEn ? 'Maintenance' : 'تحت الصيانة') 
                      : (isEn ? 'Stopped' : 'متوقف')}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white">
                    {isEn ? (asset.nameEn || asset.name) : asset.name}
                  </h3>
                  <div className="text-xs text-[#8696AE] mt-0.5">
                    {isEn ? (asset.categoryEn || asset.category) : asset.category}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0B1222] border border-[#1A2440] text-xs space-y-1">
                  <div className="flex justify-between text-[#8696AE]">
                    <span>{isEn ? 'Site:' : 'الموقع:'}</span>
                    <span className="text-white truncate max-w-[160px]">
                      {isEn ? (asset.siteNameEn || asset.siteName) : asset.siteName}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#8696AE]">
                    <span>{isEn ? 'Critical Service:' : 'الخدمة الحرجة:'}</span>
                    <span className="text-blue-300 font-medium truncate max-w-[160px]">
                      {(isEn ? (asset.criticalServiceNameEn || asset.criticalServiceName) : asset.criticalServiceName) || (isEn ? 'Unlinked' : 'غير مرتبط')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#8696AE]">
                    <span>{isEn ? 'Operating Hours:' : 'ساعات التشغيل:'}</span>
                    <span className="mono text-white">
                      {asset.operatingHours.toLocaleString()} {isEn ? 'hrs' : 'ساعة'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1E2A44] text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#8696AE]">{isEn ? 'Priority:' : 'الأولوية:'}</span>
                  <span className="mono font-bold text-rose-400">{asset.priorityScore}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openAssetDetail(asset.id);
                  }}
                  className="text-blue-400 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>{isEn ? 'Details' : 'التفاصيل'}</span>
                  {isEn ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Asset Drawer */}
      <AddAssetDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
      />
    </div>
  );
};
