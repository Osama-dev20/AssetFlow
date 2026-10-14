import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockStore, type Asset, type CriticalService } from '../../data/mockStore';
import { StatusChip } from '../../shared/ui/StatusChip';
import { X, Link as LinkIcon, ShieldAlert, Check, Plus } from 'lucide-react';

interface LinkAssetServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
}

export const LinkAssetServiceModal: React.FC<LinkAssetServiceModalProps> = ({
  isOpen,
  onClose,
  asset,
}) => {
  const { language, addToast } = useApp();
  const store = useMockStore();
  const isRTL = language === 'ar';

  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const allServices = store.getServices();

  // Filter out services already linked to prevent duplicates, then filter by search term
  const availableServices = allServices.filter(
    (s) => !asset.criticalServiceIds.includes(s.id)
  );

  const filteredAvailable = availableServices.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) return;

    const success = store.linkAssetToService(asset.id, selectedServiceId);
    if (success) {
      const srv = allServices.find((s) => s.id === selectedServiceId);
      addToast({
        type: 'success',
        title: isRTL ? 'تم ربط الخدمة بنجاح' : 'Service Linked',
        description: isRTL
          ? `تم ربط الخدمة "${srv?.name}" بالأصل "${asset.name}".`
          : `Service "${srv?.name}" linked to asset "${asset.name}".`,
      });
      setSelectedServiceId('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 animate-scale-up text-start select-none"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 flex items-center justify-center">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isRTL ? 'ربط الأصل بخدمة حرجة' : 'Link Asset to Critical Service'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRTL
                  ? `ربط التبعية التشغيلية للأصل: ${asset.name}`
                  : `Define service dependency for: ${asset.name}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLink} className="space-y-4 pt-5">
          {availableServices.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-300 font-medium">
                {isRTL
                  ? 'تم ربط هذا الأصل بجميع الخدمات الحرجة المتاحة في النظام بالفعل.'
                  : 'This asset is already linked to all registered critical services.'}
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isRTL ? 'اختر الخدمة الحرجة' : 'Select Critical Service'}{' '}
                <span className="text-rose-400">*</span>
              </label>

              {/* Autocomplete Search Filter */}
              <div className="mb-3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isRTL ? 'بحث بالاسم أو الكود (Autocomplete)...' : 'Type to search service...'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {filteredAvailable.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    {isRTL ? 'لا توجد خدمات مطابقة للبحث' : 'No matching services found'}
                  </p>
                ) : (
                  filteredAvailable.map((service) => {
                    const isSelected = selectedServiceId === service.id;
                    return (
                      <div
                        key={service.id}
                        onClick={() => setSelectedServiceId(service.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10'
                            : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                      >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white text-xs truncate">
                            {service.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono" dir="ltr">
                            {service.code}
                          </span>
                        </div>
                        <StatusChip criticality={service.criticality} size="sm" />
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-600 bg-slate-800'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })
              )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={!selectedServiceId || availableServices.length === 0}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 bg-gradient-to-r from-[#1d68bd] to-[#2eaf7d] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isRTL ? 'تأكيد الربط' : 'Link Service'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
