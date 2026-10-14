import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useMockStore } from '../../data/mockStore';
import { Search, Filter, X, RotateCcw } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { language } = useApp();
  const store = useMockStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const isRTL = language === 'ar';

  const sites = store.getSites();

  const searchQuery = searchParams.get('search') || '';
  const siteFilter = searchParams.get('site') || 'all';
  const statusFilter = searchParams.get('status') || 'all';

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const hasActiveFilters = searchQuery !== '' || siteFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 select-none">
      {/* 1. Search Box */}
      <div className="relative w-full md:w-80">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => updateParam('search', e.target.value)}
          placeholder={isRTL ? 'بحث بالاسم، كود الأصل، أو الفئة...' : 'Search by name, asset code, or category...'}
          className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
        />
        <Search
          className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 ${
            isRTL ? 'left-3' : 'right-3'
          }`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => updateParam('search', '')}
            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer ${
              isRTL ? 'right-2.5' : 'left-2.5'
            }`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Dropdown Filters */}
      <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
        {/* Site Filter */}
        <div className="flex items-center gap-1.5 min-w-[150px] flex-1 md:flex-initial">
          <select
            value={siteFilter}
            onChange={(e) => updateParam('site', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">{isRTL ? 'جميع المواقع' : 'All Sites'}</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 min-w-[140px] flex-1 md:flex-initial">
          <select
            value={statusFilter}
            onChange={(e) => updateParam('status', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">{isRTL ? 'كافة الحالات' : 'All Statuses'}</option>
            <option value="operational">{isRTL ? 'يعمل (Operational)' : 'Operational'}</option>
            <option value="maintenance">{isRTL ? 'تحت الصيانة (Maintenance)' : 'In Maintenance'}</option>
            <option value="out_of_service">{isRTL ? 'خارج الخدمة (Offline)' : 'Out of Service'}</option>
          </select>
        </div>

        {/* Reset Button if active */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-1 transition-all cursor-pointer"
            title={isRTL ? 'إلغاء جميع الفلاتر' : 'Clear filters'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isRTL ? 'تصفير' : 'Reset'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
