import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Users, Plus, Search, Filter, Eye, Pencil, Trash2, Calendar, AlertTriangle, Award, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmployees, useDepartments, usePenaltyRecords, usePenaltyTypes, useCommendationRecords, useCommendationTypes, useLeaveRecords, useLeaveTypes } from "@/lib/data-init";
import { incrementStatus, promotionStatus, isNearRetirement, formatYM, formatDateAR } from "@/lib/calc";
import type { Employee } from "@/lib/types";
import { uid } from "@/lib/storage";
import { EmployeeUnifiedEditDialog } from "@/components/employee/EmployeeUnifiedEditDialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/employees/")({
  component: EmployeesPage,
});

type Filter = "all" | "active" | "increment" | "promotion" | "leave" | "retirement";

function EmployeesPage() {
  const [employees, setEmployees] = useEmployees();
  const [departments] = useDepartments();
  const [penalties] = usePenaltyRecords();
  const [penaltyTypes] = usePenaltyTypes();
  const [commendations] = useCommendationRecords();
  const [commendationTypes] = useCommendationTypes();
  const [leaves] = useLeaveRecords();
  const [leaveTypes] = useLeaveTypes();

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [open, setOpen] = useState(false);

  const enriched = useMemo(() => {
    const today = new Date().toISOString().slice(0,10);
    return employees.map((e) => {
      const inc = incrementStatus(e);
      const pr = promotionStatus(e, penalties, penaltyTypes, commendations, commendationTypes);
      const currentLeave = leaves.find((l) => l.employeeId === e.id && l.status === "approved" && l.startDate <= today && l.endDate >= today);
      const onLeave = !!currentLeave;
      const nearRet = isNearRetirement(e.birthDate, 12);
      return { e, inc, pr, onLeave, currentLeave, nearRet };
    });
  }, [employees, penalties, penaltyTypes, commendations, commendationTypes, leaves]);

  const counts = useMemo(() => ({
    all: enriched.length,
    active: enriched.filter((x) => x.e.status === "active").length,
    increment: enriched.filter((x) => x.inc.due && x.e.status === "active").length,
    promotion: enriched.filter((x) => x.pr.due && x.e.status === "active").length,
    leave: enriched.filter((x) => x.onLeave).length,
    retirement: enriched.filter((x) => x.nearRet).length,
  }), [enriched]);

  const filtered = useMemo(() => {
    let list = enriched;
    if (filter === "active") list = list.filter((x) => x.e.status === "active");
    if (filter === "increment") list = list.filter((x) => x.inc.due);
    if (filter === "promotion") list = list.filter((x) => x.pr.due);
    if (filter === "leave") list = list.filter((x) => x.onLeave);
    if (filter === "retirement") list = list.filter((x) => x.nearRet);
    if (q.trim()) {
      const t = q.trim();
      list = list.filter((x) => x.e.fullName.includes(t) || x.e.empNo.includes(t) || x.e.nationalId.includes(t) || x.e.phone.includes(t));
    }
    return list;
  }, [enriched, filter, q]);

  function onDelete(id: string) {
    if (!confirm("حذف هذا الموظف؟")) return;
    setEmployees((prev) => prev.filter((p) => p.id !== id));
  }

  function exportCSV() {
    const rows = [["الرقم الوظيفي", "الاسم", "القسم", "العنوان الوظيفي", "الدرجة", "المرحلة", "تاريخ المباشرة", "الحالة"]];
    filtered.forEach((x) => {
      const d = departments.find((dd) => dd.id === x.e.departmentId);
      rows.push([x.e.empNo, x.e.fullName, d?.name || "", x.e.jobTitle, String(x.e.grade), String(x.e.stage), x.e.startDate, x.e.status]);
    });
    const csv = "\uFEFF" + rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `employees-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="إدارة الموظفين"
        subtitle="إدارة شاملة لسجلات الموظفين والعلاوات والترقيات"
        iconBg="gradient-primary"
        actions={
          <>
            <Button variant="outline" onClick={exportCSV} className="gap-2"><Download className="size-4" /> تصدير</Button>
            <Button onClick={() => { setEditEmp(null); setOpen(true); }} className="gap-2 gradient-primary text-primary-foreground border-0">
              <Plus className="size-4" /> إضافة موظف
            </Button>
          </>
        }
      />

      {/* Search & filters */}
      <div className="rounded-2xl bg-card border border-border p-4 space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث سريع بالاسم، الرقم الوظيفي، رقم الهوية..."
            className="pr-10 h-11 rounded-xl"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Filter className="size-4 text-muted-foreground self-center ml-1" />
          <span className="text-xs text-muted-foreground self-center">فلترة سريعة:</span>
          <FilterPill active={filter === "all"} onClick={() => setFilter("all")} count={counts.all}>الكل</FilterPill>
          <FilterPill active={filter === "active"} onClick={() => setFilter("active")} count={counts.active} tone="success">مستمر</FilterPill>
          <FilterPill active={filter === "leave"} onClick={() => setFilter("leave")} count={counts.leave} tone="info">في إجازة</FilterPill>
          <FilterPill active={filter === "increment"} onClick={() => setFilter("increment")} count={counts.increment} tone="amber">مستحق العلاوة</FilterPill>
          <FilterPill active={filter === "promotion"} onClick={() => setFilter("promotion")} count={counts.promotion} tone="warning">مستحق الترقية</FilterPill>
          <FilterPill active={filter === "retirement"} onClick={() => setFilter("retirement")} count={counts.retirement} tone="destructive">قرب التقاعد</FilterPill>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs">
              <tr>
                <th className="text-right px-4 py-3 font-semibold">#</th>
                <th className="text-right px-4 py-3 font-semibold">الموظف</th>
                <th className="text-right px-4 py-3 font-semibold">الرقم الوظيفي</th>
                <th className="text-right px-4 py-3 font-semibold">القسم</th>
                <th className="text-right px-4 py-3 font-semibold">الدرجة/المرحلة</th>
                <th className="text-right px-4 py-3 font-semibold">تاريخ المباشرة</th>
                <th className="text-right px-4 py-3 font-semibold">الحالة</th>
                <th className="text-right px-4 py-3 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((x, idx) => {
                const dept = departments.find((d) => d.id === x.e.departmentId);
                return (
                  <tr key={x.e.id} className="hover:bg-muted/20 transition-smooth">
                    <td className="px-4 py-3 arabic-num text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                          {x.e.fullName.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold">{x.e.fullName}</div>
                          <div className="text-xs text-muted-foreground">
                            {x.e.jobTitle}
                            {x.e.position && <span className="text-amber font-bold"> · {x.e.position}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-primary arabic-num">{x.e.empNo}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{dept?.name}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold arabic-num">الدرجة {x.e.grade}</div>
                      <div className="text-xs text-muted-foreground arabic-num">المرحلة {x.e.stage}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="arabic-num">{formatDateAR(x.e.startDate)}</div>
                      <div className="text-xs text-primary font-semibold arabic-num">{formatYM(x.e.startDate)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={x.e.status} onLeave={x.onLeave} nearRet={x.nearRet} />
                      {x.currentLeave && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-info">
                          <Calendar className="size-3" />
                          <span className="font-semibold">{leaveTypes.find((lt) => lt.id === x.currentLeave!.leaveTypeId)?.name || "إجازة"}</span>
                          <span className="text-muted-foreground arabic-num">· {formatDateAR(x.currentLeave.startDate)} → {formatDateAR(x.currentLeave.endDate)}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to="/employees/$id" params={{ id: x.e.id }}>
                          <Button size="icon" variant="ghost" className="size-8 text-info hover:bg-info/10"><Eye className="size-4" /></Button>
                        </Link>
                        <Button size="icon" variant="ghost" className="size-8 text-amber hover:bg-amber/10" onClick={() => { setEditEmp(x.e); setOpen(true); }}><Pencil className="size-4" /></Button>
                        <Button size="icon" variant="ghost" className="size-8 text-destructive hover:bg-destructive/10" onClick={() => onDelete(x.e.id)}><Trash2 className="size-4" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">لا توجد نتائج</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground arabic-num">
          عرض {filtered.length} من أصل {employees.length} موظف
        </div>
      </div>

      <EmployeeUnifiedEditDialog
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) setEditEmp(null); }}
        employee={editEmp}
      />
    </div>
  );
}

function FilterPill({ children, active, onClick, count, tone = "primary" }: {
  children: React.ReactNode; active: boolean; onClick: () => void; count: number;
  tone?: "primary" | "success" | "info" | "amber" | "warning" | "destructive";
}) {
  const toneActive = {
    primary: "bg-primary text-primary-foreground",
    success: "bg-success text-success-foreground",
    info: "bg-info text-info-foreground",
    amber: "bg-amber text-amber-foreground",
    warning: "bg-warning text-warning-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  }[tone];
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-smooth border",
        active ? `${toneActive} border-transparent shadow-sm` : "bg-background hover:bg-muted/50 border-border text-muted-foreground"
      )}
    >
      {children}
      <span className="arabic-num bg-black/10 dark:bg-white/10 px-1.5 rounded-full text-[10px]">{count}</span>
    </button>
  );
}

function StatusBadge({ status, onLeave, nearRet }: { status: Employee["status"]; onLeave: boolean; nearRet: boolean }) {
  if (onLeave) return <Badge tone="info">في إجازة</Badge>;
  if (status === "retired") return <Badge tone="muted">متقاعد</Badge>;
  if (status === "dismissed") return <Badge tone="destructive">مفصول</Badge>;
  if (status === "contract_ended") return <Badge tone="destructive">انهاء عقد</Badge>;
  if (status === "resigned") return <Badge tone="warning">مستقيل</Badge>;
  if (status === "deceased") return <Badge tone="muted">متوفي</Badge>;
  if (status === "seconded") return <Badge tone="info">منسب</Badge>;
  if (status === "assigned") return <Badge tone="info">تكليف</Badge>;
  if (nearRet) return <Badge tone="warning">قرب التقاعد</Badge>;
  return <Badge tone="success">مستمر</Badge>;
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "success" | "info" | "warning" | "destructive" | "muted" }) {
  const map = {
    success: "bg-success/15 text-success",
    info: "bg-info/15 text-info",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/15 text-destructive",
    muted: "bg-muted text-muted-foreground",
  }[tone];
  return <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold", map)}>{children}</span>;
}
