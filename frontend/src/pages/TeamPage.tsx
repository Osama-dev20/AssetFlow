import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, UserPlus, Mail, Phone, Shield, Check, X, ShieldAlert, Wrench } from 'lucide-react';
import { TeamMember } from '../types';

export const TeamPage: React.FC = () => {
  const { teamMembers, inviteTeamMember, currentUser, language, showToast } = useApp();
  const isEn = language === 'en';
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'operations' | 'technician' | 'reporter'>('technician');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+970 599 ');
  const [specialty, setSpecialty] = useState('');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    inviteTeamMember({
      name,
      role,
      email,
      phone,
      specialty: specialty || (isEn ? 'General Maintenance' : 'صيانة عامة')
    });

    showToast(
      isEn ? 'Invitation Sent Successfully' : 'تم إرسال الدعوة بنجاح',
      isEn ? `Invited ${name} to team as ${role}` : `تمت دعوة ${name} إلى الفريق`,
      'success'
    );

    setName('');
    setEmail('');
    setSpecialty('');
    setIsInviteOpen(false);
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full ${isEn ? 'text-left font-sans' : 'text-right font-arabic'}`}>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isEn ? 'Team & Engineering Permissions' : 'الفريق والصلاحيات الهندسية'}
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
            {isEn 
              ? 'Govern engineers, field technicians, and reporters, configuring emergency response authority.' 
              : 'إدارة المهندسين، الفنيين، والمُبلِّغين وتوزيع صلاحيات إصدار أوامر العمل والاستجابة للطوارئ.'}
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="h-11 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <UserPlus size={16} />
          <span>{isEn ? 'Invite New Team Member' : 'دعوة عضو فريق جديد'}</span>
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-2xl bg-[#0F1729] border border-[#1E2A44] hover:border-blue-500/40 transition-all flex flex-col justify-between gap-4 card-glow"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-11 h-11 rounded-xl bg-gradient-to-br ${member.avatarGradient} text-white font-bold text-sm flex items-center justify-center shadow-md`}>
                    {member.initials}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {isEn ? (member.nameEn || member.name) : member.name}
                    </h3>
                    <div className="text-xs text-blue-400 font-medium">
                      {isEn ? (member.roleEn || member.role) : member.roleArabic}
                    </div>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  member.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' :
                  member.status === 'busy' ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-500/15 text-slate-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    member.status === 'active' ? 'bg-emerald-400' :
                    member.status === 'busy' ? 'bg-amber-400' : 'bg-slate-400'
                  }`} />
                  {member.status === 'active' ? (isEn ? 'Available' : 'متاح') : member.status === 'busy' ? (isEn ? 'Dispatched' : 'في مهمة') : (isEn ? 'Offline' : 'غير متصل')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0B1222] border border-[#1A2440] text-xs space-y-1.5">
                <div className="flex justify-between text-[#8696AE]">
                  <span>{isEn ? 'Specialty:' : 'التخصص:'}</span>
                  <span className="text-white font-medium truncate max-w-[160px]">
                    {isEn ? (member.specialtyEn || member.specialty) : member.specialty}
                  </span>
                </div>
                <div className="flex justify-between text-[#8696AE]">
                  <span>{isEn ? 'Work Email:' : 'البريد المهني:'}</span>
                  <span className="text-blue-300 mono">{member.email}</span>
                </div>
                <div className="flex justify-between text-[#8696AE]">
                  <span>{isEn ? 'Phone:' : 'الهاتف الميداني:'}</span>
                  <span className="text-white mono">{member.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E2A44] flex items-center justify-between text-xs text-[#8696AE]">
              <span>{isEn ? 'Assigned Work Orders:' : 'أوامر العمل المسندة:'}</span>
              <span className="mono font-bold text-white px-2 py-0.5 rounded bg-[#16213A]">
                {member.activeOrdersCount} {isEn ? 'orders' : 'أوامر'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ROLES & PERMISSIONS OVERVIEW TABLE */}
      <div className="rounded-2xl bg-[#0F1729] border border-[#1E2A44] p-5 sm:p-6 space-y-4">
        <h3 className="font-bold text-base text-white">
          {isEn ? 'Engineering Permission Matrix by Role' : 'مصفوفة الصلاحيات حسب الدور الهندسي'}
        </h3>

        <div className="overflow-x-auto">
          <table className={`w-full ${isEn ? 'text-left' : 'text-right'} border-collapse text-xs sm:text-sm`}>
            <thead>
              <tr className="border-b border-[#1E2A44] text-[#8696AE] text-[11px] font-bold">
                <th className="py-3 px-3">{isEn ? 'Role' : 'الدور'}</th>
                <th className="py-3 px-3">{isEn ? 'Register Assets' : 'تسجيل الأصول'}</th>
                <th className="py-3 px-3">{isEn ? 'Create/Dispatch Orders' : 'إنشاء وتعيين أوامر العمل'}</th>
                <th className="py-3 px-3">{isEn ? 'Close & Verify PM' : 'إغلاق وتأكيد الصيانة'}</th>
                <th className="py-3 px-3">{isEn ? 'Adjust Formula Weights' : 'تعديل أوزان الأولوية'}</th>
                <th className="py-3 px-3">{isEn ? 'Manage Team & Sites' : 'إدارة الفريق والمواقع'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A2440]/70">
              <tr className="hover:bg-[#121C33]">
                <td className="py-3 px-3 font-bold text-white">
                  {isEn ? 'Facility Director (Admin)' : 'مدير المنظمة (Admin)'}
                </td>
                <td className="py-3 px-3 text-emerald-400">{isEn ? 'Full Access' : 'نعم (كامل)'}</td>
                <td className="py-3 px-3 text-emerald-400">{isEn ? 'Yes' : 'نعم'}</td>
                <td className="py-3 px-3 text-emerald-400">{isEn ? 'Yes' : 'نعم'}</td>
                <td className="py-3 px-3 text-emerald-400">{isEn ? 'Yes' : 'نعم'}</td>
                <td className="py-3 px-3 text-emerald-400">{isEn ? 'Yes' : 'نعم'}</td>
              </tr>
              <tr className="hover:bg-[#121C33]">
                <td className="py-3 px-3 font-bold text-white">
                  {isEn ? 'Operations & Reliability Mgr' : 'مسؤول العمليات (Operations)'}
                </td>
                <td className="py-3 px-3 text-emerald-400">{isEn ? 'Yes' : 'نعم'}</td>
                <td className="py-3 px-3 text-emerald-400">{isEn ? 'Yes' : 'نعم'}</td>
                <td className="py-3 px-3 text-emerald-400">{isEn ? 'Yes' : 'نعم'}</td>
                <td className="py-3 px-3 text-[#8696AE]">{isEn ? 'Read Only' : 'قراءة فقط'}</td>
                <td className="py-3 px-3 text-[#8696AE]">{isEn ? 'Read Only' : 'قراءة فقط'}</td>
              </tr>
              <tr className="hover:bg-[#121C33]">
                <td className="py-3 px-3 font-bold text-white">
                  {isEn ? 'Field Technician' : 'فني معتمد (Technician)'}
                </td>
                <td className="py-3 px-3 text-[#8696AE]">{isEn ? 'Read Only' : 'قراءة فقط'}</td>
                <td className="py-3 px-3 text-emerald-400">{isEn ? 'Update Status & Notes' : 'تحديث الحالة والملاحظات'}</td>
                <td className="py-3 px-3 text-emerald-400">{isEn ? 'Complete Tasks' : 'إتمام المهام'}</td>
                <td className="py-3 px-3 text-[#8696AE]">{isEn ? 'No' : 'لا'}</td>
                <td className="py-3 px-3 text-[#8696AE]">{isEn ? 'No' : 'لا'}</td>
              </tr>
              <tr className="hover:bg-[#121C33]">
                <td className="py-3 px-3 font-bold text-white">
                  {isEn ? 'Operational Reporter' : 'مُبلّغ بلاغات (Reporter)'}
                </td>
                <td className="py-3 px-3 text-[#8696AE]">{isEn ? 'Read Only' : 'قراءة فقط'}</td>
                <td className="py-3 px-3 text-emerald-400">{isEn ? 'Report New Fault Only' : 'إبلاغ عن عطل جديد فقط'}</td>
                <td className="py-3 px-3 text-[#8696AE]">{isEn ? 'No' : 'لا'}</td>
                <td className="py-3 px-3 text-[#8696AE]">{isEn ? 'No' : 'لا'}</td>
                <td className="py-3 px-3 text-[#8696AE]">{isEn ? 'No' : 'لا'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* INVITE MEMBER MODAL */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03060E]/80 backdrop-blur-md">
          <div className={`w-full max-w-md bg-[#0F1729] border border-[#26324A] rounded-2xl p-6 shadow-2xl ${isEn ? 'text-left font-sans' : 'text-right font-arabic'} space-y-5 animate-slide-up`}>
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2A44]">
              <h3 className="font-bold text-lg text-white">
                {isEn ? 'Invite New Engineer or Technician' : 'دعوة مهندس أو فني جديد'}
              </h3>
              <button onClick={() => setIsInviteOpen(false)} className="text-[#8696AE] hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Full Name *' : 'الاسم الثلاثي *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isEn ? 'e.g. Eng. Bassem Tamimi' : 'مثال: م. باسم التميمي'}
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${isEn ? 'text-left' : 'text-right'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Role & Permissions' : 'الدور والصلاحية'}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className={`w-full h-11 px-3 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${isEn ? 'text-left' : 'text-right'} cursor-pointer`}
                >
                  <option value="technician">{isEn ? 'Certified Technician (Execute work orders & PM)' : 'فني معتمد (تنفيذ أوامر العمل والصيانة)'}</option>
                  <option value="operations">{isEn ? 'Operations Engineer (Dispatch and schedule)' : 'مسؤول عمليات وتشغيل (جدولة وتوزيع المهام)'}</option>
                  <option value="admin">{isEn ? 'Facility Director (Full administrative rights)' : 'مدير المنشأة (صلاحيات كاملة)'}</option>
                  <option value="reporter">{isEn ? 'Reporter (Report faults only)' : 'مُبلّغ بلاغات فقط'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Professional Email *' : 'البريد الإلكتروني المهني *'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bassem@nabluswater.ps"
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${isEn ? 'text-left' : 'text-right'} mono`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Field Phone Number' : 'رقم الهاتف للتواصل الميداني'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${isEn ? 'text-left' : 'text-right'} mono`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Engineering Specialty' : 'التخصص الدقيق'}
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder={isEn ? 'e.g. Diesel engines, Hydraulic pumps, SCADA' : 'مثال: محركات ديزل، أنظمة هيدروليك، شبكات SCADA'}
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${isEn ? 'text-left' : 'text-right'}`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {isEn ? 'Send Activation Invite' : 'إرسال دعوة التفعيل'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="h-11 px-4 rounded-xl border border-[#26324A] bg-[#16213A] text-[#A3B1C6] text-xs font-semibold cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'إلغاء'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
