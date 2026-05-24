import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Users, Award, AlertTriangle, CalendarDays, TrendingUp, ArrowUp, Lightbulb, Zap, ShieldCheck, Plus, FileBarChart, Users2, Crown, Calendar } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useEmployees, usePenaltyRecords, useCommendationRecords, useLeaveRecords, useDepartments, useCommittees } from "@/lib/data-init";
import { incrementStatus, promotionStatus, isNearRetirement, formatYM, formatDateAR } from "@/lib/calc";
import { usePenaltyTypes, useCommendationTypes } from "@/lib/data-init";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

function Dashboard() {
  const [employees] = useEmployees();
  const [penalties] = usePenaltyRecords();
  const [penaltyTypes] = usePenaltyTypes();
  const [commendations] = useCommendationRecords();
  const [commendationTypes] = useCommendationTypes();
  const [leaves] = useLeaveRecords();
  const [departments] = useDepartments();
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const [pickerAction, setPickerAction] = useState<null | { tab: string; label: string }>(null);
  const [pickQ, setPickQ] = useState("");

  const pickerResults = useMemo(() => {
    if (!pickerAction) return [];
    const term = pickQ.trim();
    const list = term
      ? employees.filter((e) => e.fullName.includes(term) || e.empNo.includes(term) || e.nationalId.includes(term) || e.phone.includes(term))
      : employees;
    return list.slice(0, 10);
  }, [pickQ, pickerAction, employees]);

  function selectEmployeeForAction(empId: string) {
    if (!pickerAction) return;
    const tab = pickerAction.tab;
    setPickerAction(null);
    setPickQ("");
    navigate({ to: "/employees/$id", params: { id: empId }, search: { tab } });
  }

  const stats = useMemo(() => {
    const active = employees.filter((e) => e.status === "active");
    const dueIncrement = active.filter((e) => incrementStatus(e, penalties, penaltyTypes, commendations, commendationTypes).due).length;
    const duePromotion = active.filter((e) => promotionStatus(e, penalties, penaltyTypes, commendations, commendationTypes).due).length;
    const activeLeavesToday = leaves.filter((l) => {
      const today = new Date().toISOString().slice(0, 10);
      return l.status === "approved" && l.startDate <= today && l.endDate >= today;
    }).length;
    const activePenalties = penalties.filter((p) => p.active).length;
    const thisMonthCommend = commendations.filter((c) => {
      const d = new Date(c.date);
      const n = new Date();
      return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
    }).length;
    return { total: employees.length, active: active.length, dueIncrement, duePromotion, activeLeavesToday, activePenalties, thisMonthCommend };
  }, [employees, penalties, penaltyTypes, commendations, commendationTypes, leaves]);

  const searchResults = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.trim();
    return employees.filter((e) =>
      e.fullName.includes(term) || e.empNo.includes(term) || e.nationalId.includes(term) || e.phone.includes(term)
    ).slice(0, 6);
  }, [q, employees]);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl gradient-hero shadow-elegant">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.78 0.16 70 / 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, oklch(0.52 0.19 280 / 0.4) 0%, transparent 50%)" }} />
        <div className="relative px-6 md:px-10 py-10 md:py-12 text-primary-foreground">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">👋</span>
            <h2 className="text-2xl md:text-3xl font-extrabold">مرحباً، مدير المنظومة</h2>
          </div>
          <p className="text-primary-foreground/80 max-w-2xl text-sm md:text-base">
            نظام متكامل لإدارة الموارد البشرية وفق التشريعات العراقية: الخدمة المدنية، الملاك، الرواتب، الانضباط، التقاعد، والعمل.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/employees" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber text-amber-foreground font-bold text-sm hover:scale-105 transition-smooth shadow-glow">
              <Users className="size-4" /> إدارة الموظفين
            </Link>
            <Link to="/reports" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 text-primary-foreground font-bold text-sm hover:bg-primary-foreground/20 transition-smooth">
              <FileBarChart className="size-4" /> مركز التقارير
            </Link>
          </div>
        </div>
      </section>

      {/* Quick search */}
      <section className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-md">
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 text-lg md:text-xl font-bold text-foreground">
            <Search className="size-5 text-amber" />
            البحث السريع عن موظف
          </div>
          <p className="text-xs text-muted-foreground mt-1">ابحث بالاسم، الرقم الوظيفي، رقم الهوية أو رقم الهاتف</p>
        </div>
        <div className="relative max-w-3xl mx-auto">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="اكتب للبحث عن موظف..."
            className="h-12 pr-12 pl-4 rounded-2xl bg-muted/40 border-border text-base"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4 max-w-3xl mx-auto rounded-2xl border border-border bg-background overflow-hidden">
            {searchResults.map((e) => {
              const dept = departments.find((d) => d.id === e.departmentId);
              return (
                <Link
                  key={e.id}
                  to="/employees/$id"
                  params={{ id: e.id }}
                  search={{ tab: undefined }}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-smooth border-b border-border last:border-0"
                >
                  <div className="size-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center">
                    {e.fullName.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{e.fullName}</div>
                    <div className="text-xs text-muted-foreground">{e.empNo} · {dept?.name} · {e.jobTitle}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lightbulb className="size-3.5 text-amber" />
          نصيحة: يمكنك البحث بالاسم، الرقم الوظيفي، رقم الهوية، أو الهاتف
        </div>
      </section>

      {/* Local data badge */}
      <section className="rounded-3xl bg-gradient-to-l from-primary to-primary-glow p-6 text-primary-foreground shadow-elegant">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-2xl bg-primary-foreground/15 flex items-center justify-center shrink-0">
            <ShieldCheck className="size-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-lg">بياناتك محفوظة محلياً في متصفحك</h3>
            <p className="text-sm text-primary-foreground/80 mt-1">جميع البيانات مخزنة في جهازك فقط — لا سيرفر، لا سحابة. خصوصية تامة.</p>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Users} label="إجمالي الموظفين" value={stats.total} hint={`${stats.active} نشط`} tone="primary" />
        <StatCard icon={ArrowUp} label="علاوات مستحقة" value={stats.dueIncrement} hint="جاهزة للصرف" tone="success" />
        <StatCard icon={TrendingUp} label="ترقيات مستحقة" value={stats.duePromotion} hint="مؤهلون للترقية" tone="amber" />
        <StatCard icon={CalendarDays} label="إجازات نشطة" value={stats.activeLeavesToday} hint="اليوم" tone="info" />
        <StatCard icon={AlertTriangle} label="عقوبات نشطة" value={stats.activePenalties} hint={stats.activePenalties === 0 ? "لا يوجد" : "سارية المفعول"} tone="destructive" />
        <StatCard icon={Award} label="كتب شكر" value={stats.thisMonthCommend} hint="هذا الشهر" tone="warning" />
      </section>

      {/* Quick actions */}
      <section className="rounded-3xl bg-card border border-border p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="size-5 text-amber" />
          <h3 className="font-extrabold text-lg">إجراءات سريعة</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <QuickActionLink icon={Plus} label="إضافة موظف" to="/employees" tone="primary" />
          <QuickActionLink icon={TrendingUp} label="العلاوات والترفيعات" to="/promotions" tone="warning" />
          <QuickActionLink icon={Users2} label="اللجان" to="/committees" tone="info" />
          <QuickActionButton icon={CalendarDays} label="منح إجازة" tone="info" onClick={() => setPickerAction({ tab: "leaves", label: "منح إجازة" })} />
          <QuickActionButton icon={AlertTriangle} label="تسجيل عقوبة" tone="destructive" onClick={() => setPickerAction({ tab: "penalties", label: "تسجيل عقوبة" })} />
          <QuickActionButton icon={Award} label="كتاب شكر" tone="warning" onClick={() => setPickerAction({ tab: "commendations", label: "كتاب شكر" })} />
        </div>
      </section>

      {/* Committees */}
      <CommitteesPreview />


      {/* Employee picker dialog for quick actions */}
      <Dialog open={!!pickerAction} onOpenChange={(o) => { if (!o) { setPickerAction(null); setPickQ(""); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>اختر الموظف لـ: {pickerAction?.label}</DialogTitle>
            <DialogDescription>ابحث بالاسم، الرقم الوظيفي، رقم الهوية أو الهاتف</DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              autoFocus
              value={pickQ}
              onChange={(e) => setPickQ(e.target.value)}
              placeholder="اكتب اسم الموظف أو رقمه..."
              className="h-11 pr-10"
            />
          </div>
          <div className="max-h-80 overflow-y-auto rounded-xl border border-border divide-y divide-border">
            {pickerResults.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">لا يوجد نتائج</p>
            ) : pickerResults.map((emp) => {
              const dept = departments.find((d) => d.id === emp.departmentId);
              return (
                <button
                  key={emp.id}
                  onClick={() => selectEmployeeForAction(emp.id)}
                  className="w-full flex items-center gap-3 p-3 text-right hover:bg-muted/50 transition-smooth"
                >
                  <div className="size-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center">
                    {emp.fullName.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{emp.fullName}</div>
                    <div className="text-xs text-muted-foreground truncate">{emp.empNo} · {dept?.name}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Near retirement preview */}
      <section className="rounded-3xl bg-card border border-border p-6 shadow-md">
        <h3 className="font-extrabold text-lg mb-4">قرب التقاعد (خلال 24 شهر)</h3>
        <NearRetirementList />
      </section>
    </div>
  );
}

type Tone = "primary" | "info" | "destructive" | "warning";
const TONE_MAP: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
  info: "bg-info/10 text-info hover:bg-info hover:text-info-foreground",
  destructive: "bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground",
  warning: "bg-warning/15 text-warning hover:bg-warning hover:text-warning-foreground",
};

function QuickActionLink({ icon: Icon, label, to, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; to: "/employees" | "/promotions" | "/committees"; tone: Tone }) {
  return (
    <Link to={to} className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl transition-smooth ${TONE_MAP[tone]}`}>
      <Icon className="size-6" />
      <span className="font-bold text-sm">{label}</span>
    </Link>
  );
}

function QuickActionButton({ icon: Icon, label, tone, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; tone: Tone; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl transition-smooth ${TONE_MAP[tone]}`}>
      <Icon className="size-6" />
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
}

function NearRetirementList() {
  const [employees] = useEmployees();
  const [departments] = useDepartments();
  const list = employees.filter((e) => isNearRetirement(e.birthDate, 24, e.retirementExtensionMonths || 0)).slice(0, 5);

  if (list.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">لا يوجد موظفون قريبون من التقاعد حالياً</p>;
  }

  return (
    <div className="divide-y divide-border">
      {list.map((e) => {
        const dept = departments.find((d) => d.id === e.departmentId);
        return (
          <div key={e.id} className="flex items-center gap-3 py-3">
            <div className="size-10 rounded-xl bg-warning/15 text-warning font-bold flex items-center justify-center text-sm">{e.fullName.slice(0, 2)}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{e.fullName}</div>
              <div className="text-xs text-muted-foreground">{dept?.name} · {e.jobTitle}</div>
            </div>
            <div className="text-xs text-muted-foreground arabic-num">العمر: {new Date().getFullYear() - new Date(e.birthDate).getFullYear()} سنة</div>
            <div className="text-xs font-bold text-warning">قرب التقاعد</div>
          </div>
        );
      })}
    </div>
  );
}

function CommitteesPreview() {
  const [committees] = useCommittees();
  const [employees] = useEmployees();
  const list = useMemo(() => [...committees].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5), [committees]);

  return (
    <section className="rounded-3xl bg-card border border-border p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users2 className="size-5 text-info" />
          <h3 className="font-extrabold text-lg">اللجان</h3>
        </div>
        <Link to="/committees" className="text-xs font-bold text-primary hover:underline">عرض الكل ←</Link>
      </div>
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          لا توجد لجان بعد.{" "}
          <Link to="/committees" className="text-primary font-bold hover:underline">أنشئ لجنة جديدة</Link>
        </p>
      ) : (
        <div className="divide-y divide-border">
          {list.map((c) => {
            const members = c.memberIds.map((id) => employees.find((e) => e.id === id)).filter(Boolean);
            const chair = c.chairId ? employees.find((e) => e.id === c.chairId) : null;
            return (
              <Link key={c.id} to="/committees" className="flex items-start gap-3 py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-smooth">
                <div className="size-10 rounded-xl bg-info/15 text-info flex items-center justify-center shrink-0"><Users2 className="size-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{c.name}</span>
                    <span className="text-xs text-muted-foreground arabic-num">رقم {c.number}</span>
                    {c.active ? <span className="text-[10px] font-bold bg-success/15 text-success px-1.5 py-0.5 rounded-full">فعّالة</span> : <span className="text-[10px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">منتهية</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap arabic-num">
                    <span className="inline-flex items-center gap-1"><Calendar className="size-3" />{formatDateAR(c.date)}</span>
                    <span>· {members.length} عضو</span>
                    {chair && <span className="inline-flex items-center gap-1 text-amber"><Crown className="size-3" />{chair.fullName}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

