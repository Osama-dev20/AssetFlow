import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockStore, type ManagedUser } from '../../data/mockStore';
import { DataTable, type Column } from '../../shared/ui/DataTable';
import { StatusChip } from '../../shared/ui/StatusChip';
import { ConfirmDialog } from '../../shared/ui/ConfirmDialog';
import { PageHeader } from '../../shared/ui/PageHeader';
import { UserFormDialog } from './UserFormDialog';
import {
  UserPlus,
  Edit2,
  Power,
  PowerOff,
  UserCheck,
  UserX,
  Mail,
  Building,
  Shield,
  Search,
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { language, addToast } = useApp();
  const store = useMockStore();
  const isRTL = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'technician' | 'reporter'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<ManagedUser | null>(null);

  const users = store.getUsers();

  // Search & Filter
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleCreateOrUpdate = (data: any) => {
    if (editingUser) {
      store.updateUser(editingUser.id, data);
      addToast({
        type: 'success',
        title: isRTL ? 'تم تحديث المستخدم' : 'User updated',
        description: isRTL
          ? `تم تحديث بيانات ${data.fullName} بنجاح.`
          : `User ${data.fullName} was updated successfully.`,
      });
    } else {
      store.addUser({
        ...data,
        status: 'active',
      });
      addToast({
        type: 'success',
        title: isRTL ? 'تمت إضافة المستخدم' : 'User created',
        description: isRTL
          ? `تمت إضافة ${data.fullName} إلى النظام بنجاح.`
          : `User ${data.fullName} added successfully.`,
      });
    }
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleToggleStatusConfirm = () => {
    if (!confirmTarget) return;
    const updated = store.toggleUserStatus(confirmTarget.id);
    if (updated) {
      addToast({
        type: updated.status === 'active' ? 'success' : 'warning',
        title:
          updated.status === 'active'
            ? isRTL
              ? 'تم تفعيل الحساب'
              : 'Account Activated'
            : isRTL
            ? 'تم تعطيل الحساب'
            : 'Account Deactivated',
        description: isRTL
          ? `تم تغيير حالة حساب ${confirmTarget.fullName} إلى: ${updated.status === 'active' ? 'نشط' : 'معطل'}.`
          : `User ${confirmTarget.fullName} status is now ${updated.status}.`,
      });
    }
    setConfirmTarget(null);
  };

  const columns: Column<ManagedUser>[] = [
    {
      key: 'fullName',
      header: isRTL ? 'الاسم والمستخدم' : 'Full Name & User',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-white text-xs shadow-xs">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-semibold text-white block">{user.fullName}</span>
            <span className="text-xs text-slate-400 font-mono" dir="ltr">
              {user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: isRTL ? 'الدور الوظيفي' : 'Role',
      sortable: true,
      render: (user) => <StatusChip status={user.role} />,
    },
    {
      key: 'status',
      header: isRTL ? 'الحالة' : 'Status',
      sortable: true,
      render: (user) => (
        <StatusChip
          status={user.status}
          label={
            user.status === 'active'
              ? isRTL
                ? 'نشط ومفعّل'
                : 'Active'
              : isRTL
              ? 'معطّل (محظور)'
              : 'Suspended'
          }
        />
      ),
    },
    {
      key: 'department',
      header: isRTL ? 'القسم / الإدارة' : 'Department',
      sortable: true,
      render: (user) => (
        <span className="text-xs text-slate-300">
          {user.department || (isRTL ? 'عام' : 'General')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: isRTL ? 'الإجراءات' : 'Actions',
      className: 'text-end',
      render: (user) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Edit */}
          <button
            type="button"
            onClick={() => {
              setEditingUser(user);
              setIsFormOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isRTL ? 'تعديل البيانات' : 'Edit User'}
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Toggle Status */}
          <button
            type="button"
            onClick={() => setConfirmTarget(user)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              user.status === 'active'
                ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                : 'text-rose-400 hover:text-emerald-400 hover:bg-emerald-500/10'
            }`}
            title={
              user.status === 'active'
                ? isRTL
                  ? 'تعطيل الحساب'
                  : 'Deactivate Account'
                : isRTL
                ? 'إعادة تفعيل الحساب'
                : 'Activate Account'
            }
          >
            {user.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Page Header */}
      <PageHeader
        title={isRTL ? 'إدارة المستخدمين والصلاحيات' : 'Users & Access Management'}
        description={
          isRTL
            ? 'التحكم بحسابات الفنيين، مدراء الصيانة ومقدمي البلاغات وتعيين الصلاحيات المؤسسية.'
            : 'Manage organization users, roles, maintenance technicians, and access permissions.'
        }
        badge={`${users.length} ${isRTL ? 'مستخدم' : 'Users'}`}
        actionText={isRTL ? 'إضافة مستخدم جديد' : 'Add New User'}
        onAction={() => {
          setEditingUser(null);
          setIsFormOpen(true);
        }}
        actionIcon={UserPlus}
      />

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? 'بحث بالاسم أو البريد...' : 'Search by name or email...'}
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
          <Search
            className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 ${
              isRTL ? 'left-3' : 'right-3'
            }`}
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'admin', labelAr: 'المدراء', labelEn: 'Admins' },
            { id: 'technician', labelAr: 'الفنيون', labelEn: 'Technicians' },
            { id: 'reporter', labelAr: 'المبلّغون', labelEn: 'Reporters' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                roleFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {isRTL ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table with Sorting, Pagination, Mobile Cards */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        keyExtractor={(u) => u.id}
        emptyTitle={isRTL ? 'لا يوجد مستخدمون مطابقون' : 'No users found'}
        emptyDescription={
          isRTL
            ? 'لم يتم العثور على أي مستخدم يطابق معايير البحث أو التصفية الحالية.'
            : 'No users matched your search criteria.'
        }
      />

      {/* Create / Edit Form Modal */}
      <UserFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingUser}
      />

      {/* Confirm Dialog for Status Toggle */}
      <ConfirmDialog
        isOpen={!!confirmTarget}
        title={
          confirmTarget?.status === 'active'
            ? isRTL
              ? 'تأكيد تعطيل حساب المستخدم'
              : 'Deactivate User Account'
            : isRTL
            ? 'تأكيد تفعيل حساب المستخدم'
            : 'Activate User Account'
        }
        description={
          confirmTarget?.status === 'active'
            ? isRTL
              ? `هل أنت متأكد من رغبتك في تعطيل حساب "${confirmTarget?.fullName}"؟ لن يتمكن من تسجيل الدخول أو استلام أوامر العمل حتى إعادة تفعيله.`
              : `Are you sure you want to deactivate "${confirmTarget?.fullName}"? They will not be able to log in.`
            : isRTL
            ? `هل تريد استعادة وتفعيل صلاحيات الدخول لحساب "${confirmTarget?.fullName}"؟`
            : `Do you want to re-activate access for "${confirmTarget?.fullName}"?`
        }
        intent={confirmTarget?.status === 'active' ? 'danger' : 'info'}
        confirmText={
          confirmTarget?.status === 'active'
            ? isRTL
              ? 'نعم، تعطيل الحساب'
              : 'Deactivate'
            : isRTL
            ? 'نعم، تفعيل الحساب'
            : 'Activate'
        }
        onConfirm={handleToggleStatusConfirm}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
};

export default UsersPage;
