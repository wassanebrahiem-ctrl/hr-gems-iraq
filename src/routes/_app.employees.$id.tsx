import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, User, CalendarDays, AlertTriangle, Award, TrendingUp, ArrowUp, Phone, IdCard, Plus, FileText, UserCircle, Pencil, Trash2, Crown, Settings2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmployees, useDepartments, useLeaveRecords, useLeaveTypes, usePenaltyRecords, usePenaltyTypes, useCommendationRecords, useCommendationTypes, useSalary, useEmployeeProfiles, useEmployeeDocuments } from "@/lib/data-init";
import { EmployeeUnifiedEditDialog } from "@/components/employee/EmployeeUnifiedEditDialog";
import { incrementStatus, promotionStatus, monthsToRetirement, ageInYears, formatYM, formatDateAR, baseSalary, formatIQD } from "@/lib/calc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uid } from "@/lib/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeProfileCard } from "@/components/employee/EmployeeProfileCard";
import { EmployeeDocuments } from "@/components/employee/EmployeeDocuments";
import { toast } from "sonner";
import type { LeaveRecord, PenaltyRecord, CommendationRecord } from "@/lib/types";

export const Route = createFileRoute("/_app/employees/$id")({
  component: EmployeeDetail,
  validateSearch: (s: Record<string, unknown>): { tab?: string } => ({
    tab: typeof s.tab === "string" ? s.tab : undefined,
  }),
});

function EmployeeDetail() {
  const { id } = useParams({ from: "/_app/employees/$id" });
  const { tab } = Route.useSearch();
  const [employees, setEmployees] = useEmployees();
  const [departments] = useDepartments();
  const [salary] = useSalary();
  const [penalties, setPenalties] = usePenaltyRecords();
  const [penaltyTypes] = usePenaltyTypes();
  const [commendations, setCommendations] = useCommendationRecords();
  const [commendationTypes] = useCommendationTypes();
  const [leaves, setLeaves] = useLeaveRecords();
  const [leaveTypes] = useLeaveTypes();
  const [profiles] = useEmployeeProfiles();
  const [documents] = useEmployeeDocuments();

  const [openLeave, setOpenLeave] = useState(false);
  const [editLeave, setEditLeave] = useState<LeaveRecord | null>(null);
  const [openPen, setOpenPen] = useState(false);
  const [editPen, setEditPen] = useState<PenaltyRecord | null>(null);
  const [openCom, setOpenCom] = useState(false);
  const [editCom, setEditCom] = useState<CommendationRecord | null>(null);
  const [confirmDel, setConfirmDel] = useState<{ kind: "leave" | "pen" | "com"; id: string } | null>(null);
  const [openEditEmployee, setOpenEditEmployee] = useState(false);

  const e = employees.find((x) => x.id === id);
  const inc = useMemo(() => e ? incrementStatus(e, penalties, penaltyTypes, commendations, commendationTypes) : null, [e, penalties, penaltyTypes, commendations, commendationTypes]);
  const pr = useMemo(() => e ? promotionStatus(e, penalties, penaltyTypes, commendations, commendationTypes) : null, [e, penalties, penaltyTypes, commendations, commendationTypes]);

  if (!e || !inc || !pr) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground mb-4">الموظف غير موجود</p>
      <Link to="/employees"><Button variant="outline">العودة</Button></Link>
    </div>
  );
  const dept = departments.find((d) => d.id === e.departmentId);
  const empLeaves = leaves.filter((l) => l.employeeId === e.id);
  const empPenalties = penalties.filter((p) => p.employeeId === e.id);
  const empCommend = commendations.filter((c) => c.employeeId === e.id);
  const empDocs = documents.filter((d) => d.employeeId === e.id);
  const profile = profiles.find((p) => p.employeeId === e.id);
  const salaryAmount = baseSalary(e, salary);
  const retMonths = monthsToRetirement(e.birthDate);

  function confirmDelete() {
    if (!confirmDel) return;
    if (confirmDel.kind === "leave") { setLeaves((p) => p.filter((x) => x.id !== confirmDel.id)); toast.success("تم حذف الإجازة"); }
    if (confirmDel.kind === "pen") { setPenalties((p) => p.filter((x) => x.id !== confirmDel.id)); toast.success("تم حذف العقوبة"); }
    if (confirmDel.kind === "com") { setCommendations((p) => p.filter((x) => x.id !== confirmDel.id)); toast.success("تم حذف كتاب الشكر"); }
    setConfirmDel(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link to="/employees" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-smooth">
          <ArrowRight className="size-4" /> رجوع للموظفين
        </Link>
        <Button onClick={() => setOpenEditEmployee(true)} className="gradient-primary text-primary-foreground border-0 gap-2 shadow-md">
          <Settings2 className="size-4" /> تعديل ملف الموظف
        </Button>
      </div>

      {/* Profile header */}
      <div className="rounded-3xl gradient-hero p-6 md:p-8 text-primary-foreground shadow-elegant">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="size-24 rounded-3xl bg-amber text-amber-foreground font-extrabold text-3xl flex items-center justify-center shadow-glow shrink-0 overflow-hidden">
            {profile?.avatarDataUrl
              ? <img src={profile.avatarDataUrl} alt={e.fullName} className="w-full h-full object-cover" />
              : e.fullName.slice(0, 2)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold">{e.fullName}</h1>
            <div className="text-primary-foreground/80 mt-1">{e.jobTitle} · {dept?.name}</div>
            {e.position && (
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-amber/90 text-amber-foreground text-xs font-bold shadow-sm">
                <Crown className="size-3.5" /> {e.position}
              </div>
            )}
            <div className="flex flex-wrap gap-3 mt-4 text-sm">
              <Chip icon={IdCard}>{e.empNo}</Chip>
              <Chip icon={Phone}>{e.phone}</Chip>
              <Chip icon={CalendarDays}>مباشرة: {formatDateAR(e.startDate)}</Chip>
              <Chip icon={User}>العمر: {ageInYears(e.birthDate)} سنة</Chip>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-primary-foreground/70">الراتب الأساسي</div>
            <div className="text-2xl font-extrabold arabic-num">{formatIQD(salaryAmount)}</div>
            <div className="text-xs text-primary-foreground/70 mt-1 arabic-num">الدرجة {e.grade} · المرحلة {e.stage}</div>
          </div>
        </div>
      </div>

      {/* Calc summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CalcCard
          icon={ArrowUp}
          tone="success"
          title="العلاوة السنوية"
          status={inc.due ? "مستحقة الآن" : `بعد ${inc.monthsRemaining} شهر`}
          detail={`آخر علاوة: ${e.lastIncrementDate ? formatDateAR(e.lastIncrementDate) : "—"} | تأخير: ${inc.delayMonths} شهر | إضافة: ${inc.bonusMonths} شهر`}
          legal="قانون رواتب الموظفين 22/2008"
          due={inc.due}
        />
        <CalcCard
          icon={TrendingUp}
          tone="amber"
          title="الترقية"
          status={pr.due ? "مستحقة الآن" : `بعد ${pr.monthsRemaining} شهر`}
          detail={`خدم ${formatYM(e.lastPromotionDate || e.startDate)} | تأخير: ${pr.delayMonths} شهر | إضافة: ${pr.bonusMonths} شهر`}
          legal="قانون الملاك 25/1960"
          due={pr.due}
        />
        <CalcCard
          icon={CalendarDays}
          tone={retMonths <= 12 ? "destructive" : "info"}
          title="التقاعد"
          status={`${Math.floor(retMonths / 12)} سنة و ${retMonths % 12} شهر`}
          detail={`السن القانوني: 63 سنة`}
          legal="قانون التقاعد الموحد 9/2014"
          due={false}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue={tab || "profile"} className="w-full">
        <TabsList className="rounded-xl bg-card border border-border p-1 h-auto flex-wrap gap-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg gap-2">
            <UserCircle className="size-4" /> الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg gap-2">
            <FileText className="size-4" /> المستمسكات ({empDocs.length})
          </TabsTrigger>
          <TabsTrigger value="leaves" className="data-[state=active]:bg-info data-[state=active]:text-info-foreground rounded-lg gap-2">
            <CalendarDays className="size-4" /> الإجازات ({empLeaves.length})
          </TabsTrigger>
          <TabsTrigger value="penalties" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground rounded-lg gap-2">
            <AlertTriangle className="size-4" /> العقوبات ({empPenalties.length})
          </TabsTrigger>
          <TabsTrigger value="commendations" className="data-[state=active]:bg-amber data-[state=active]:text-amber-foreground rounded-lg gap-2">
            <Award className="size-4" /> كتب الشكر ({empCommend.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <EmployeeProfileCard employeeId={e.id} />
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <SectionShell title="مستمسكات الموظف">
            <EmployeeDocuments employeeId={e.id} />
          </SectionShell>
        </TabsContent>

        <TabsContent value="leaves" className="mt-4">
          <SectionShell
            title="سجل الإجازات"
            action={<Button onClick={() => setOpenLeave(true)} className="gap-2 bg-info text-info-foreground hover:bg-info/90"><Plus className="size-4" /> منح إجازة</Button>}
          >
            {empLeaves.length === 0 ? <Empty msg="لا توجد إجازات مسجلة" /> : (
              <RecordTable rows={empLeaves.map((l) => {
                const t = leaveTypes.find((x) => x.id === l.leaveTypeId);
                return { left: t?.name || "—", mid: `${formatDateAR(l.startDate)} → ${formatDateAR(l.endDate)}`, right: `${l.days} يوم`, status: l.status === "approved" ? "موافق عليها" : l.status === "pending" ? "قيد الموافقة" : "مرفوضة", reason: l.reason, onEdit: () => setEditLeave(l), onDelete: () => setConfirmDel({ kind: "leave", id: l.id }) };
              })} />
            )}
          </SectionShell>
        </TabsContent>

        <TabsContent value="penalties" className="mt-4">
          <SectionShell
            title="سجل العقوبات"
            action={<Button onClick={() => setOpenPen(true)} className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"><Plus className="size-4" /> تسجيل عقوبة</Button>}
          >
            {empPenalties.length === 0 ? <Empty msg="لا توجد عقوبات مسجلة" /> : (
              <RecordTable rows={empPenalties.map((p) => {
                const t = penaltyTypes.find((x) => x.id === p.penaltyTypeId);
                return { left: t?.name || "—", mid: formatDateAR(p.date), right: `تأخير ${t?.promotionDelayMonths} شهر`, status: p.active ? "سارية" : "منتهية", reason: p.reason, onEdit: () => setEditPen(p), onDelete: () => setConfirmDel({ kind: "pen", id: p.id }) };
              })} />
            )}
          </SectionShell>
        </TabsContent>

        <TabsContent value="commendations" className="mt-4">
          <SectionShell
            title="سجل كتب الشكر والتقدير"
            action={<Button onClick={() => setOpenCom(true)} className="gap-2 bg-amber text-amber-foreground hover:bg-amber/90"><Plus className="size-4" /> منح كتاب شكر</Button>}
          >
            {empCommend.length === 0 ? <Empty msg="لا توجد كتب شكر مسجلة" /> : (
              <RecordTable rows={empCommend.map((c) => {
                const t = commendationTypes.find((x) => x.id === c.commendationTypeId);
                return { left: t?.name || "—", mid: formatDateAR(c.date), right: `قدم +${t?.seniorityBonusMonths} شهر`, status: "ساري", reason: c.reason, onEdit: () => setEditCom(c), onDelete: () => setConfirmDel({ kind: "com", id: c.id }) };
              })} />
            )}
          </SectionShell>
        </TabsContent>
      </Tabs>

      {/* Add/Edit dialogs */}
      <LeaveDialog
        open={openLeave || !!editLeave}
        onOpenChange={(v) => { if (!v) { setOpenLeave(false); setEditLeave(null); } }}
        employeeId={e.id}
        initial={editLeave}
        onSave={(rec) => {
          setLeaves((p) => {
            const exists = p.some((x) => x.id === rec.id);
            return exists ? p.map((x) => x.id === rec.id ? rec : x) : [rec, ...p];
          });
          toast.success(editLeave ? "تم تحديث الإجازة" : "تم منح الإجازة");
        }}
      />
      <PenaltyDialog
        open={openPen || !!editPen}
        onOpenChange={(v) => { if (!v) { setOpenPen(false); setEditPen(null); } }}
        employeeId={e.id}
        initial={editPen}
        onSave={(rec) => {
          setPenalties((p) => {
            const exists = p.some((x) => x.id === rec.id);
            return exists ? p.map((x) => x.id === rec.id ? rec : x) : [rec, ...p];
          });
          toast.success(editPen ? "تم تحديث العقوبة" : "تم تسجيل العقوبة");
        }}
      />
      <CommendDialog
        open={openCom || !!editCom}
        onOpenChange={(v) => { if (!v) { setOpenCom(false); setEditCom(null); } }}
        employeeId={e.id}
        initial={editCom}
        onSave={(rec) => {
          setCommendations((p) => {
            const exists = p.some((x) => x.id === rec.id);
            return exists ? p.map((x) => x.id === rec.id ? rec : x) : [rec, ...p];
          });
          toast.success(editCom ? "تم تحديث كتاب الشكر" : "تم منح كتاب الشكر");
        }}
      />

      <AlertDialog open={!!confirmDel} onOpenChange={(v) => !v && setConfirmDel(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EmployeeUnifiedEditDialog open={openEditEmployee} onOpenChange={setOpenEditEmployee} employee={e} />
    </div>
  );
}

function Chip({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/15 text-xs font-medium"><Icon className="size-3.5" />{children}</span>;
}

function CalcCard({ icon: Icon, tone, title, status, detail, legal, due }: { icon: React.ComponentType<{ className?: string }>; tone: "success" | "amber" | "info" | "destructive"; title: string; status: string; detail: string; legal: string; due: boolean }) {
  const map = { success: "bg-success/10 text-success", amber: "bg-amber/15 text-amber", info: "bg-info/10 text-info", destructive: "bg-destructive/10 text-destructive" }[tone];
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <div className={`size-10 rounded-xl flex items-center justify-center ${map}`}><Icon className="size-5" /></div>
        <div className="font-bold">{title}</div>
        {due && <span className="mr-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-success text-success-foreground">جاهزة</span>}
      </div>
      <div className="text-2xl font-extrabold arabic-num">{status}</div>
      <div className="text-xs text-muted-foreground mt-1 arabic-num">{detail}</div>
      <div className="text-[10px] text-muted-foreground mt-2 italic">المرجع: {legal}</div>
    </div>
  );
}

function SectionShell({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
function Empty({ msg }: { msg: string }) { return <p className="text-sm text-muted-foreground text-center py-8">{msg}</p>; }

type Row = { left: string; mid: string; right: string; status: string; reason?: string; onEdit?: () => void; onDelete?: () => void };
function RecordTable({ rows }: { rows: Row[] }) {
  return (
    <div className="divide-y divide-border">
      {rows.map((r, i) => (
        <div key={i} className="py-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="font-bold flex-1">{r.left}</div>
            <div className="text-muted-foreground arabic-num">{r.mid}</div>
            <div className="text-muted-foreground arabic-num">{r.right}</div>
            <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted">{r.status}</div>
            {r.onEdit && (
              <Button variant="ghost" size="icon" className="size-8" onClick={r.onEdit} aria-label="تعديل">
                <Pencil className="size-4" />
              </Button>
            )}
            {r.onDelete && (
              <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={r.onDelete} aria-label="حذف">
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
          {r.reason && <div className="text-xs text-muted-foreground mt-1">السبب: {r.reason}</div>}
        </div>
      ))}
    </div>
  );
}

function LeaveDialog({ open, onOpenChange, employeeId, initial, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; employeeId: string; initial: LeaveRecord | null; onSave: (r: LeaveRecord) => void }) {
  const [leaveTypes] = useLeaveTypes();
  const [typeId, setTypeId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    submittingRef.current = false;
    if (initial) {
      setTypeId(initial.leaveTypeId); setStart(initial.startDate); setEnd(initial.endDate); setReason(initial.reason || "");
    } else {
      setTypeId(""); setStart(""); setEnd(""); setReason("");
    }
  }, [open, initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    const days = Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1);
    const rec: LeaveRecord = initial
      ? { ...initial, leaveTypeId: typeId, startDate: start, endDate: end, days, reason }
      : { id: uid("lv_"), employeeId, leaveTypeId: typeId, startDate: start, endDate: end, days, reason, status: "approved", createdAt: new Date().toISOString() };
    onSave(rec);
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl"><DialogHeader><DialogTitle>{initial ? "تعديل الإجازة" : "منح إجازة"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4 py-3">
          <div><Label>نوع الإجازة</Label><Select value={typeId} onValueChange={setTypeId}><SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger><SelectContent>{leaveTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>من</Label><Input type="date" value={start} onChange={e => setStart(e.target.value)} required /></div>
            <div><Label>إلى</Label><Input type="date" value={end} onChange={e => setEnd(e.target.value)} required /></div>
          </div>
          <div><Label>السبب</Label><Textarea rows={2} value={reason} onChange={e => setReason(e.target.value)} /></div>
          <DialogFooter><Button type="submit" className="gradient-primary text-primary-foreground border-0">حفظ</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PenaltyDialog({ open, onOpenChange, employeeId, initial, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; employeeId: string; initial: PenaltyRecord | null; onSave: (r: PenaltyRecord) => void }) {
  const [penaltyTypes] = usePenaltyTypes();
  const [typeId, setTypeId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState("");
  const [active, setActive] = useState(true);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    submittingRef.current = false;
    if (initial) {
      setTypeId(initial.penaltyTypeId); setDate(initial.date); setReason(initial.reason || ""); setActive(initial.active);
    } else {
      setTypeId(""); setDate(new Date().toISOString().slice(0, 10)); setReason(""); setActive(true);
    }
  }, [open, initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    const rec: PenaltyRecord = initial
      ? { ...initial, penaltyTypeId: typeId, date, reason, active }
      : { id: uid("pn_"), employeeId, penaltyTypeId: typeId, date, reason, active: true, createdAt: new Date().toISOString() };
    onSave(rec);
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl"><DialogHeader><DialogTitle>{initial ? "تعديل العقوبة" : "تسجيل عقوبة"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4 py-3">
          <div><Label>نوع العقوبة</Label><Select value={typeId} onValueChange={setTypeId}><SelectTrigger><SelectValue placeholder="اختر العقوبة" /></SelectTrigger><SelectContent>{penaltyTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.name} (تأخير {t.promotionDelayMonths} شهر)</SelectItem>)}</SelectContent></Select></div>
          <div><Label>تاريخ العقوبة</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} required /></div>
          <div><Label>السبب</Label><Textarea rows={2} value={reason} onChange={e => setReason(e.target.value)} required /></div>
          {initial && (
            <div><Label>الحالة</Label><Select value={active ? "1" : "0"} onValueChange={(v) => setActive(v === "1")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">سارية</SelectItem><SelectItem value="0">منتهية</SelectItem></SelectContent></Select></div>
          )}
          <DialogFooter><Button type="submit" className="bg-destructive text-destructive-foreground">حفظ</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CommendDialog({ open, onOpenChange, employeeId, initial, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; employeeId: string; initial: CommendationRecord | null; onSave: (r: CommendationRecord) => void }) {
  const [comTypes] = useCommendationTypes();
  const [typeId, setTypeId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    submittingRef.current = false;
    if (initial) {
      setTypeId(initial.commendationTypeId); setDate(initial.date); setReason(initial.reason || "");
    } else {
      setTypeId(""); setDate(new Date().toISOString().slice(0, 10)); setReason("");
    }
  }, [open, initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    const rec: CommendationRecord = initial
      ? { ...initial, commendationTypeId: typeId, date, reason }
      : { id: uid("co_"), employeeId, commendationTypeId: typeId, date, reason, createdAt: new Date().toISOString() };
    onSave(rec);
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl"><DialogHeader><DialogTitle>{initial ? "تعديل كتاب الشكر" : "منح كتاب شكر"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4 py-3">
          <div><Label>نوع الكتاب</Label><Select value={typeId} onValueChange={setTypeId}><SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger><SelectContent>{comTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.name} (+{t.seniorityBonusMonths} شهر قدم)</SelectItem>)}</SelectContent></Select></div>
          <div><Label>التاريخ</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} required /></div>
          <div><Label>السبب</Label><Textarea rows={2} value={reason} onChange={e => setReason(e.target.value)} required /></div>
          <DialogFooter><Button type="submit" className="bg-amber text-amber-foreground">حفظ</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
