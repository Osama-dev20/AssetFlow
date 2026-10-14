import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useMockStore, type CriticalService } from '../../data/mockStore';
import { StatusChip } from '../../shared/ui/StatusChip';
import { ConfirmDialog } from '../../shared/ui/ConfirmDialog';
import { LinkAssetServiceModal } from '../links/LinkAssetServiceModal';
import { AssetFormDialog } from './AssetFormDialog';
import {
  Box,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Link as LinkIcon,
  Unlink,
  Edit2,
  Activity,
  AlertTriangle,
  Plus,
} from 'lucide-react';

export const AssetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, addToast } = useApp();
  const store = useMockStore();
  const isRTL = language === 'ar';

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [unlinkingService, setUnlinkingService] = useState<CriticalService | null>(null);

  const asset = id ? store.getAssetById(id) : undefined;
  const linkedServices = asset ? store.getServicesForAsset(asset.id) : [];

  if (!asset) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white mb-2">
          {isRTL ? 'الأصل غير موجود' : 'Asset Not Found'}
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          {isRTL ? 'لم يتم العثور على الأصل المطلوب.' : 'The requested asset does not exist.'}
        </p>
        <Link
          to="/dashboard/assets"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRTL ? 'العودة لقائمة الأصول' : 'Back to Assets'}</span>
        </Link>
      </div>
    );
  }

  const handleUpdate = (data: any) => {
    store.updateAsset(asset.id, data);
    addToast({
      type: 'success',
      title: isRTL ? 'تم التحديث' : 'Asset Updated',
      description: isRTL ? 'تم تحديث بيانات الأصل بنجاح.' : 'Asset details updated.',
    });
    setIsEditOpen(false);
  };

  const handleUnlinkConfirm = () => {
    if (!unlinkingService) return;
    const success = store.unlinkAssetFromService(asset.id, unlinkingService.id);
    if (success) {
      addToast({
        type: 'info',
        title: isRTL ? 'تم إلغاء الربط' : 'Service Unlinked',
        description: isRTL
          ? `تم فك ارتباط الخدمة "${unlinkingService.name}" عن هذا الأصل.`
          : `Service "${unlinkingService.name}" unlinked.`,
      });
    }
    setUnlinkingService(null);
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/dashboard/assets"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors self-start"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRTL ? 'الرجوع لسجل الأصول' : 'Back to Assets Directory'}</span>
        </Link>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isRTL ? 'تعديل البيانات' : 'Edit Asset'}</span>
          </button>
        </div>
      </div>

      {/* Main Asset Details Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1d68bd] to-[#2eaf7d] p-3 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <Box className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {asset.name}
                </h1>
                <StatusChip status={asset.status} />
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                <span className="font-mono bg-slate-800 px-2.5 py-1 rounded-md text-blue-300 font-bold" dir="ltr">
                  {asset.code}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{asset.siteName}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  <span>{asset.category}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Description Box */}
        {asset.description && (
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {isRTL ? 'المواصفات الفنية والوصف التشغيلي' : 'Technical Specifications'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
              {asset.description}
            </p>
          </div>
        )}
      </div>

      {/* Sub-section: Linked Critical Services */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                {isRTL ? 'الخدمات الحرجة المرتبطة بهذا الأصل' : 'Linked Critical Services'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isRTL
                ? 'أي توقف أو صيانة لهذا الأصل سيؤثر مباشرة على جاهزية الخدمات المدرجة أدناه.'
                : 'Any downtime on this asset directly impacts availability of these services.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsLinkModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#1d68bd] to-[#2eaf7d] shadow-md shadow-blue-600/20 hover:scale-102 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRTL ? 'ربط خدمة حرجة جديدة' : 'Link Critical Service'}</span>
          </button>
        </div>

        {/* Services List */}
        {linkedServices.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <LinkIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">
              {isRTL
                ? 'لا توجد خدمات حرجة مرتبطة بهذا الأصل حالياً. انقر على "ربط خدمة حرجة" لإضافة علاقة تبعية.'
                : 'No critical services linked to this asset yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {linkedServices.map((service) => (
              <div
                key={service.id}
                className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 flex items-start justify-between gap-3 shadow-md hover:border-slate-600 transition-all"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm truncate">
                      {service.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded" dir="ltr">
                      {service.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="pt-1">
                    <StatusChip criticality={service.criticality} size="sm" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setUnlinkingService(service)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer flex-shrink-0"
                  title={isRTL ? 'فك الارتباط' : 'Unlink Service'}
                >
                  <Unlink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Link Service Modal */}
      <LinkAssetServiceModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        asset={asset}
      />

      {/* Edit Asset Modal */}
      <AssetFormDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdate}
        initialData={asset}
      />

      {/* Unlink Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!unlinkingService}
        title={isRTL ? 'تأكيد فك ارتباط الخدمة الحرجة' : 'Unlink Critical Service'}
        description={
          isRTL
            ? `هل تريد إزالة التبعية بين الأصل "${asset.name}" والخدمة "${unlinkingService?.name}"؟`
            : `Are you sure you want to unlink service "${unlinkingService?.name}" from this asset?`
        }
        intent="warning"
        confirmText={isRTL ? 'نعم، فك الارتباط' : 'Unlink'}
        onConfirm={handleUnlinkConfirm}
        onCancel={() => setUnlinkingService(null)}
      />
    </div>
  );
};

export default AssetDetailsPage;
