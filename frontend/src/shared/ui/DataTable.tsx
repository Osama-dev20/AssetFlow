import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Database,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  sortKey?: keyof T | ((item: T) => any);
  className?: string;
  mobileHidden?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  cardRender?: (item: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  error = null,
  onRetry,
  emptyTitle,
  emptyDescription,
  pageSize = 8,
  onRowClick,
  cardRender,
}: DataTableProps<T>) {
  const { language } = useApp();
  const isRTL = language === 'ar';

  const [sortColumnKey, setSortColumnKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortColumnKey) return data;

    const column = columns.find((c) => c.key === sortColumnKey);
    if (!column) return data;

    return [...data].sort((a, b) => {
      let valA: any;
      let valB: any;

      if (typeof column.sortKey === 'function') {
        valA = column.sortKey(a);
        valB = column.sortKey(b);
      } else if (column.sortKey) {
        valA = a[column.sortKey];
        valB = b[column.sortKey];
      } else {
        valA = (a as any)[column.key];
        valB = (b as any)[column.key];
      }

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === 'asc' ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });
  }, [data, sortColumnKey, sortDirection, columns]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    if (sortColumnKey === column.key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumnKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumnKey(column.key);
      setSortDirection('asc');
    }
  };

  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-4 space-y-4">
        {/* Table Skeleton Header */}
        <div className="h-10 bg-slate-800/60 rounded-xl animate-pulse" />
        {/* Table Skeleton Rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-14 bg-slate-800/40 rounded-xl animate-pulse flex items-center px-4 gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-700/50" />
            <div className="h-4 bg-slate-700/50 rounded-md w-1/4" />
            <div className="h-4 bg-slate-700/40 rounded-md w-1/5" />
            <div className="h-4 bg-slate-700/30 rounded-md w-1/6" />
            <div className="h-6 bg-slate-700/40 rounded-full w-20 ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-8 sm:p-12 text-center shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          {isRTL ? 'حدث خطأ أثناء تحميل البيانات' : 'Failed to load data'}
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          {error}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isRTL ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        )}
      </div>
    );
  }

  // 3. Empty State
  if (data.length === 0) {
    return (
      <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-10 sm:p-16 text-center shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Database className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          {emptyTitle || (isRTL ? 'لا توجد بيانات متاحة' : 'No data available')}
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          {emptyDescription ||
            (isRTL
              ? 'لم يتم العثور على أي عناصر مطابقة في الوقت الحالي. يمكنك إضافة عنصر جديد للبدء.'
              : 'No items match your criteria. You can add a new item to get started.')}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* ========================================================
          A. DESKTOP VIEW: Full-featured Data Table (>= 768px)
         ======================================================== */}
      <div className="hidden md:block bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-sm">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    onClick={() => handleSort(column)}
                    className={`px-5 py-3.5 text-start select-none ${
                      column.sortable
                        ? 'cursor-pointer hover:text-white transition-colors group'
                        : ''
                    } ${column.className || ''}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <span className="text-slate-500 group-hover:text-blue-400 transition-colors">
                          {sortColumnKey === column.key ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-blue-400" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-blue-400" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {paginatedData.map((item) => {
                const key = keyExtractor(item);
                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`transition-colors ${
                      onRowClick
                        ? 'cursor-pointer hover:bg-slate-800/60'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-5 py-4 align-middle ${column.className || ''}`}
                      >
                        {column.render
                          ? column.render(item)
                          : (item as any)[column.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          B. MOBILE VIEW: Beautiful Responsive Card Layout (< 768px)
         ======================================================== */}
      <div className="md:hidden space-y-3">
        {paginatedData.map((item) => {
          const key = keyExtractor(item);

          if (cardRender) {
            return (
              <div key={key} onClick={() => onRowClick && onRowClick(item)}>
                {cardRender(item)}
              </div>
            );
          }

          return (
            <div
              key={key}
              onClick={() => onRowClick && onRowClick(item)}
              className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3 transition-all ${
                onRowClick ? 'cursor-pointer active:scale-98' : ''
              }`}
            >
              {columns
                .filter((col) => !col.mobileHidden)
                .map((column) => (
                  <div
                    key={column.key}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="font-medium text-slate-400">
                      {column.header}
                    </span>
                    <div className="font-semibold text-white text-end max-w-[65%] truncate">
                      {column.render
                        ? column.render(item)
                        : (item as any)[column.key]}
                    </div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>

      {/* ========================================================
          C. PAGINATION CONTROLS (Universal for Desktop & Mobile)
         ======================================================== */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3 bg-slate-900/40 border border-slate-800/60 rounded-xl text-xs text-slate-400">
          <div>
            {isRTL
              ? `عرض ${(currentPage - 1) * pageSize + 1} إلى ${Math.min(
                  currentPage * pageSize,
                  sortedData.length
                )} من إجمالي ${sortedData.length} عنصر`
              : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(
                  currentPage * pageSize,
                  sortedData.length
                )} of ${sortedData.length} items`}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <span className="px-3 py-1 font-semibold text-slate-200">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Next page"
            >
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
