import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUp, TrendingUp, CheckCircle2, Undo2, Pencil, Search, Filter, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees, useDepartments, usePenaltyRecords, usePenaltyTypes, useCommendationRecords, useCommendationTypes } from "@/lib/data-init";
import { incrementStatus, promotionStatus, formatDateAR } from "@/lib/calc";
import type { Employee } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/promotions/")({
  component: PromotionsPage,
});

type Mode = "increment" | "promotion";
type FilterKey = "due" | "soon" | "all";

function PromotionsPage() {
  const [employees, setEmployees] = useEmployees();
  const [departments] = useDepartments();
  const [penalties] = usePenaltyRecords();
  const [penaltyTypes] = usePenaltyTypes();
  const [commendations] = useCommendationRecords();
  const [commendationTypes] = useCommendationTypes();

  const [q, setQ] = useState("");
  const [deptId, setDeptId] = useState<string>("all");
  const [filter, setFilter] = useState<FilterKey>("due");

  const [editTarget, setEditTarget] = useState<{ emp: Employee; mode: Mode } | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<{ emp: Employee; mode: Mode } | null>(null);

  const rows = useMemo(() => {
    const term = q.trim();
    return employees
      .filter((e) => e.status === "active")
      .filter((e) => (deptId === "all" ? true : e.departmentId === deptId))
      .filter((e) => !term || e.fullName.includes(term) || e.empNo.includes(term) || e.nationalId.includes(term))
      .map((e) => ({
        emp: e,
        inc: incrementStatus(e, penalties, penaltyTypes, commendations, commendationTypes),
        pr: promotionStatus(e, penalties, penaltyTypes, commendations, commendationTypes),
      }));
  }, [employees, penalties, penaltyTypes, commendations, commendationTypes, q, deptId]);

  function applyFilter(mode: Mode) {
    return rows.filter((r) => {
      const s = mode === "increment" ? r.inc : r.pr;
      if (filter === "due") return s.due;
      if (filter === "soon") return !s.due && s.monthsRemaining <= 3;
      return true;
    });
  }

  function approveIncrement(emp: Employee) {
    const today = new Date().toISOString().slice(0, 10);
    setEmployees((p) => p.map((x) => x.id === emp.id ? { ...x, lastIncrementDate: today, stage: Math.min((x.stage || 1) + 1, 11) } : x));
    toast.success(`تم منح العلاوة لـ ${emp.fullName}`);
  }

  function approvePromotion(emp: Employee) {
    const today = new Date().toISOString().slice(0, 10);
    setEmployees((p) => p.map((x) => x.id === emp.id ? { ...x, lastPromotionDate: today, grade: Math.max((x.grade || 10) - 1, 1), stage: 1, lastIncrementDate: today } : x));
    toast.success(`تمت ترقية ${emp.fullName}`);
  }

  function revoke() {
    if (!revokeTarget) return;
    const { emp, mode } = revokeTarget;
    if (mode === "increment") {
      const cur = new Date(emp.lastIncrementDate || emp.startDate);
      cur.setMonth(cur.getMonth() - 12);
      const back = cur.toISOString().slice(0, 10);
      setEmployees((p) => p.map((x) => x.id === emp.id ? { ...x, lastIncrementDate: back, stage: Math.max((x.stage || 1) - 1, 1) } : x));
      toast.success("تم إلغاء منح العلاوة");
    } else {
      setEmployees((p) => p.map((x) => x.id === emp.id ? { ...x, grade: Math.min((x.grade || 1) + 1, 10), lastPromotionDate: x.startDate } : x));
      toast.success("تم إلغاء الترقية");
    }
    setRevokeTarget(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="العلاوات والترفيعات" description="إدارة كاملة لمنح العلاوة السنوية والترقية لكل موظف" icon={TrendingUp} />

      {/* Filters */}
      <div className="rounded-2xl bg-card border border-border p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالاسم، الرقم الوظيفي، الهوية..." className="h-10 pr-9" />
        </div>
        <Select value={deptId} onValueChange={setDeptId}>
          <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأقسام</SelectItem>
            {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex gap-1.5 items-center">
          <Filter className="size-4 text-muted-foreground" />
          {(["due", "soon", "all"] as FilterKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`flex-1 h-10 rounded-lg text-sm font-bold transition-smooth ${filter === k ? "bg-primary text-primary-foreground shadow" : "bg-muted hover:bg-muted/70"}`}
            >
              {k === "due" ? "مستحق" : k === "soon" ? "قريب (3 أشهر)" : "الكل"}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="increment">
        <TabsList className="rounded-xl bg-card border border-border p-1 h-auto">
          <TabsTrigger value="increment" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground rounded-lg gap-2">
            <ArrowUp className="size-4" /> العلاوات السنوية
          </TabsTrigger>
          <TabsTrigger value="promotion" className="data-[state=active]:bg-amber data-[state=active]:text-amber-foreground rounded-lg gap-2">
            <TrendingUp className="size-4" /> الترقيات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="increment" className="mt-4">
          <RowsTable
            mode="increment"
            list={applyFilter("increment")}
            departments={departments}
            onApprove={approveIncrement}
            onRevoke={(emp) => setRevokeTarget({ emp, mode: "increment" })}
            onEdit={(emp) => setEditTarget({ emp, mode: "increment" })}
          />
        </TabsContent>
        <TabsContent value="promotion" className="mt-4">
          <RowsTable
            mode="promotion"
            list={applyFilter("promotion")}
            departments={departments}
            onApprove={approvePromotion}
            onRevoke={(emp) => setRevokeTarget({ emp, mode: "promotion" })}
            onEdit={(emp) => setEditTarget({ emp, mode: "promotion" })}
          />
        </TabsContent>
      </Tabs>

      {/* Manual edit */}
      <ManualEditDialog
        target={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={(empId, patch) => {
          setEmployees((p) => p.map((x) => x.id === empId ? { ...x, ...patch } : x));
          toast.success("تم التعديل اليدوي");
          setEditTarget(null);
        }}
      />

      <AlertDialog open={!!revokeTarget} onOpenChange={(v) => !v && setRevokeTarget(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد إلغاء المنح</AlertDialogTitle>
            <AlertDialogDescription>
              {revokeTarget?.mode === "increment"
                ? "سيتم إعادة المرحلة خطوة للخلف وإرجاع تاريخ آخر علاوة 12 شهراً."
                : "سيتم إعادة الدرجة خطوة للخلف وإرجاع تاريخ آخر ترقية لتاريخ المباشرة."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>تراجع</AlertDialogCancel>
            <AlertDialogAction onClick={revoke} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">إلغاء المنح</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RowsTable({ mode, list, departments, onApprove, onRevoke, onEdit }: {
  mode: Mode;
  list: { emp: Employee; inc: ReturnType<typeof incrementStatus>; pr: ReturnType<typeof promotionStatus> }[];
  departments: { id: string; name: string }[];
  onApprove: (e: Employee) => void;
  onRevoke: (e: Employee) => void;
  onEdit: (e: Employee) => void;
}) {
  if (list.length === 0) {
    return <div className="rounded-2xl bg-card border border-border p-10 text-center text-muted-foreground">لا توجد سجلات مطابقة</div>;
  }
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs">
            <tr>
              <th className="p-3 text-right">الموظف</th>
              <th className="p-3 text-right">القسم</th>
              <th className="p-3 text-right">الدرجة/المرحلة</th>
              <th className="p-3 text-right">{mode === "increment" ? "آخر علاوة" : "آخر ترقية"}</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">تأخير/إضافة</th>
              <th className="p-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map(({ emp, inc, pr }) => {
              const s = mode === "increment" ? inc : pr;
              const dept = departments.find((d) => d.id === emp.departmentId);
              const lastDate = mode === "increment" ? emp.lastIncrementDate : emp.lastPromotionDate;
              return (
                <tr key={emp.id} className="hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="size-9 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">{emp.fullName.slice(0, 2)}</div>
                      <div>
                        <div className="font-semibold">{emp.fullName}</div>
                        <div className="text-xs text-muted-foreground arabic-num">{emp.empNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{dept?.name || "—"}</td>
                  <td className="p-3 arabic-num">د{emp.grade} / م{emp.stage}</td>
                  <td className="p-3 arabic-num">{lastDate ? formatDateAR(lastDate) : "—"}</td>
                  <td className="p-3">
                    {s.due ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-success/15 text-success">مستحق الآن</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-muted text-muted-foreground arabic-num">بعد {s.monthsRemaining} شهر</span>
                    )}
                  </td>
                  <td className="p-3 text-xs arabic-num">
                    <span className="text-destructive">−{s.delayMonths}</span> / <span className="text-success">+{s.bonusMonths}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" disabled={!s.due} onClick={() => onApprove(emp)} className="gap-1 bg-success text-success-foreground hover:bg-success/90 h-8">
                        <CheckCircle2 className="size-3.5" /> منح
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onRevoke(emp)} className="gap-1 h-8">
                        <Undo2 className="size-3.5" /> إلغاء
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onEdit(emp)} className="gap-1 h-8">
                        <Pencil className="size-3.5" /> يدوي
                      </Button>
                      <Link to="/employees/$id" params={{ id: emp.id }} search={{ tab: undefined }} className="inline-flex items-center justify-center size-8 rounded-md border border-border hover:bg-muted">
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManualEditDialog({ target, onClose, onSave }: {
  target: { emp: Employee; mode: Mode } | null;
  onClose: () => void;
  onSave: (empId: string, patch: Partial<Employee>) => void;
}) {
  const isInc = target?.mode === "increment";
  const initial = target ? (isInc ? target.emp.lastIncrementDate : target.emp.lastPromotionDate) || target.emp.startDate : "";
  const [date, setDate] = useState("");
  const [stage, setStage] = useState<number>(1);
  const [grade, setGrade] = useState<number>(10);

  // sync when target opens
  useMemoSync(target, () => {
    if (!target) return;
    setDate(initial);
    setStage(target.emp.stage);
    setGrade(target.emp.grade);
  });

  if (!target) return null;

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل يدوي — {target.emp.fullName}</DialogTitle>
          <DialogDescription>
            {isInc ? "تعديل تاريخ آخر علاوة والمرحلة يدوياً" : "تعديل تاريخ آخر ترقية والدرجة يدوياً"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>{isInc ? "تاريخ آخر علاوة" : "تاريخ آخر ترقية"}</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          {isInc ? (
            <div>
              <Label>المرحلة (1-11)</Label>
              <Input type="number" min={1} max={11} value={stage} onChange={(e) => setStage(Number(e.target.value))} />
            </div>
          ) : (
            <div>
              <Label>الدرجة (1-10)</Label>
              <Input type="number" min={1} max={10} value={grade} onChange={(e) => setGrade(Number(e.target.value))} />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button onClick={() => onSave(target.emp.id, isInc ? { lastIncrementDate: date, stage } : { lastPromotionDate: date, grade })}>حفظ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect } from "react";
function useMemoSync<T>(dep: T, fn: () => void) {
  useEffect(() => { fn(); /* eslint-disable-next-line */ }, [dep]);
}
