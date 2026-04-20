import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  FileBarChart, Users, ArrowUp, TrendingUp, Award, AlertTriangle, FileText,
  Calendar, BarChart3, Download, Zap, Eye, Bell, CheckCircle2, Clock, Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  useEmployees, useDepartments, usePenaltyRecords, usePenaltyTypes,
  useCommendationRecords, useCommendationTypes,
} from "@/lib/data-init";
import { incrementStatus, promotionStatus, formatDateAR, monthsToRetirement, isNearRetirement } from "@/lib/calc";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_app/reports/")({
  component: Reports,
});

type Tone = "success" | "info" | "amber" | "primary" | "destructive";

interface ReportData {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: Tone;
  columns: string[];
  rows: (string | number)[][];
  highlight?: string; // optional alert summary
}

function downloadCSV(filename: string, columns: string[], rows: (string | number)[][]) {
  const all = [columns, ...rows.map((r) => r.map((v) => String(v)))];
  const csv = "\uFEFF" + all.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function Reports() {
  const [employees] = useEmployees();
  const [departments] = useDepartments();
  const [penalties] = usePenaltyRecords();
  const [penaltyTypes] = usePenaltyTypes();
  const [commendations] = useCommendationRecords();
  const [commendationTypes] = useCommendationTypes();

  const [openReport, setOpenReport] = useState<ReportData | null>(null);

  // ====== Build reports ======
  const reports = useMemo<Record<string, ReportData>>(() => {
    const dueIncrements = employees
      .map((e) => ({ e, s: incrementStatus(e) }))
      .filter((x) => x.s.due);

    const duePromotions = employees
      .map((e) => ({ e, s: promotionStatus(e, penalties, penaltyTypes, commendations, commendationTypes) }))
      .filter((x) => x.s.due);

    const nearRetirees = employees.filter((e) => isNearRetirement(e.birthDate, 12));

    return {
      increments: {
        key: "increments",
        title: "العلاوات السنوية المستحقة",
        description: "الموظفون الذين أكملوا سنة كاملة منذ آخر علاوة وفق قانون رواتب موظفي الدولة 22/2008",
        icon: ArrowUp,
        tone: "success",
        columns: ["#", "الرقم الوظيفي", "الاسم", "القسم", "الدرجة/المرحلة", "آخر علاوة", "الأشهر المنقضية", "الحالة"],
        rows: dueIncrements.map((x, i) => {
          const d = departments.find((dd) => dd.id === x.e.departmentId);
          return [
            i + 1,
            x.e.empNo,
            x.e.fullName,
            d?.name || "—",
            `${x.e.grade}/${x.e.stage}`,
            formatDateAR(x.e.lastIncrementDate || x.e.startDate),
            `${x.s.monthsSinceLast} شهر`,
            "مستحقة",
          ];
        }),
        highlight: dueIncrements.length > 0
          ? `يوجد ${dueIncrements.length} موظف مستحق للعلاوة السنوية ويتطلب إصدار قرار`
          : undefined,
      },
      promotions: {
        key: "promotions",
        title: "الترقيات المستحقة",
        description: "الموظفون الذين أكملوا المدة القانونية للترقية وفق قانون الملاك 25/1960",
        icon: TrendingUp,
        tone: "primary",
        columns: ["#", "الرقم الوظيفي", "الاسم", "الدرجة الحالية", "آخر ترقية", "تأخير العقوبات", "إضافة الشكر", "الحالة"],
        rows: duePromotions.map((x, i) => [
          i + 1,
          x.e.empNo,
          x.e.fullName,
          x.e.grade,
          formatDateAR(x.e.lastPromotionDate || x.e.startDate),
          `${x.s.delayMonths} شهر`,
          `${x.s.bonusMonths} شهر`,
          "مستحقة",
        ]),
        highlight: duePromotions.length > 0
          ? `يوجد ${duePromotions.length} موظف مستحق للترقية إلى الدرجة الأعلى`
          : undefined,
      },
      employees: {
        key: "employees",
        title: "قائمة الموظفين",
        description: "جميع الموظفين المسجلين في النظام مع بياناتهم الأساسية",
        icon: Users,
        tone: "info",
        columns: ["#", "الرقم", "الاسم", "القسم", "العنوان الوظيفي", "الدرجة/المرحلة", "تاريخ المباشرة", "الحالة"],
        rows: employees.map((e, i) => {
          const d = departments.find((x) => x.id === e.departmentId);
          return [
            i + 1, e.empNo, e.fullName, d?.name || "—", e.jobTitle,
            `${e.grade}/${e.stage}`, formatDateAR(e.startDate), e.status,
          ];
        }),
      },
      departments: {
        key: "departments",
        title: "توزيع الموظفين حسب الأقسام",
        description: "إحصائية بأعداد الموظفين في كل قسم",
        icon: BarChart3,
        tone: "info",
        columns: ["#", "القسم", "الرمز", "عدد الموظفين", "النسبة"],
        rows: departments.map((d, i) => {
          const c = employees.filter((e) => e.departmentId === d.id).length;
          const pct = employees.length ? ((c / employees.length) * 100).toFixed(1) : "0";
          return [i + 1, d.name, d.code, c, `${pct}%`];
        }),
      },
      penalties: {
        key: "penalties",
        title: "العقوبات الانضباطية",
        description: "جميع العقوبات الصادرة بحق الموظفين وفق قانون انضباط موظفي الدولة 14/1991",
        icon: AlertTriangle,
        tone: "destructive",
        columns: ["#", "الرقم", "اسم الموظف", "نوع العقوبة", "التاريخ", "السبب", "نشطة"],
        rows: penalties.map((p, i) => {
          const e = employees.find((x) => x.id === p.employeeId);
          const t = penaltyTypes.find((x) => x.id === p.penaltyTypeId);
          return [i + 1, e?.empNo || "—", e?.fullName || "—", t?.name || "—", formatDateAR(p.date), p.reason, p.active ? "نعم" : "لا"];
        }),
      },
      commendations: {
        key: "commendations",
        title: "كتب الشكر والتقدير",
        description: "كتب الشكر الممنوحة وأثرها في القدم وفق المادة 21 من قانون 14/1991",
        icon: Award,
        tone: "amber",
        columns: ["#", "الرقم", "اسم الموظف", "نوع الكتاب", "التاريخ", "القدم الممنوح", "السبب"],
        rows: commendations.map((c, i) => {
          const e = employees.find((x) => x.id === c.employeeId);
          const t = commendationTypes.find((x) => x.id === c.commendationTypeId);
          return [i + 1, e?.empNo || "—", e?.fullName || "—", t?.name || "—", formatDateAR(c.date), `${t?.seniorityBonusMonths || 0} شهر`, c.reason];
        }),
      },
      retirement: {
        key: "retirement",
        title: "المقاربون لسن التقاعد",
        description: "الموظفون الذين تبقى لهم أقل من سنة على بلوغ سن التقاعد القانوني (63) - قانون 9/2014",
        icon: Clock,
        tone: "amber",
        columns: ["#", "الرقم", "الاسم", "تاريخ الميلاد", "الأشهر المتبقية", "القسم"],
        rows: nearRetirees.map((e, i) => {
          const d = departments.find((x) => x.id === e.departmentId);
          return [i + 1, e.empNo, e.fullName, formatDateAR(e.birthDate), `${monthsToRetirement(e.birthDate)} شهر`, d?.name || "—"];
        }),
        highlight: nearRetirees.length > 0
          ? `يوجد ${nearRetirees.length} موظف مقارب لسن التقاعد - يلزم البدء بإجراءات الإحالة`
          : undefined,
      },
      seniority: {
        key: "seniority",
        title: "تأثير الأقدمية",
        description: "صافي تأثير العقوبات وكتب الشكر على قدم الموظفين",
        icon: Sparkles,
        tone: "primary",
        columns: ["#", "الاسم", "أشهر التأخير", "أشهر الإضافة", "صافي القدم"],
        rows: employees.map((e, i) => {
          const dly = penalties.filter((p) => p.employeeId === e.id && p.active)
            .reduce((s, p) => s + (penaltyTypes.find((x) => x.id === p.penaltyTypeId)?.promotionDelayMonths || 0), 0);
          const bns = commendations.filter((c) => c.employeeId === e.id)
            .reduce((s, c) => s + (commendationTypes.find((x) => x.id === c.commendationTypeId)?.seniorityBonusMonths || 0), 0);
          return [i + 1, e.fullName, dly, bns, bns - dly];
        }),
      },
      full: {
        key: "full",
        title: "التقرير الشامل",
        description: "ملخص شامل لكل موظف مع كل المؤشرات الإدارية والقانونية",
        icon: FileText,
        tone: "primary",
        columns: ["#", "الرقم", "الاسم", "القسم", "الدرجة/المرحلة", "حالة العلاوة", "حالة الترقية", "العقوبات", "كتب الشكر"],
        rows: employees.map((e, i) => {
          const d = departments.find((x) => x.id === e.departmentId);
          const inc = incrementStatus(e);
          const pr = promotionStatus(e, penalties, penaltyTypes, commendations, commendationTypes);
          return [
            i + 1, e.empNo, e.fullName, d?.name || "—", `${e.grade}/${e.stage}`,
            inc.due ? "مستحقة" : `بعد ${inc.monthsRemaining} شهر`,
            pr.due ? "مستحقة" : `بعد ${pr.monthsRemaining} شهر`,
            penalties.filter((p) => p.employeeId === e.id).length,
            commendations.filter((c) => c.employeeId === e.id).length,
          ];
        }),
      },
    };
  }, [employees, departments, penalties, penaltyTypes, commendations, commendationTypes]);

  // ====== Alerts ======
  const dueIncCount = reports.increments.rows.length;
  const duePromCount = reports.promotions.rows.length;
  const nearRetCount = reports.retirement.rows.length;
  const activePenCount = penalties.filter((p) => p.active).length;
  const totalAlerts = dueIncCount + duePromCount + nearRetCount;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileBarChart}
        title="مركز التقارير"
        subtitle="معاينة التقارير بصورة أنيقة قبل التصدير، مع تنبيهات فورية للمستحقين"
        iconBg="gradient-primary"
      />

      {/* Alert banner */}
      {totalAlerts > 0 && (
        <section className="rounded-3xl bg-gradient-to-l from-amber/15 via-amber/5 to-transparent border-2 border-amber/40 p-5 shadow-elegant">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-2xl bg-amber text-amber-foreground flex items-center justify-center shrink-0 shadow-md animate-pulse">
              <Bell className="size-6" />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-lg text-foreground mb-1">تنبيهات تتطلب الإجراء</div>
              <p className="text-sm text-muted-foreground mb-3">يوجد {totalAlerts} حالة بحاجة لمراجعة وإصدار قرارات إدارية</p>
              <div className="flex flex-wrap gap-2">
                <AlertChip count={dueIncCount} label="علاوة مستحقة" tone="success" onClick={() => setOpenReport(reports.increments)} />
                <AlertChip count={duePromCount} label="ترقية مستحقة" tone="primary" onClick={() => setOpenReport(reports.promotions)} />
                <AlertChip count={nearRetCount} label="مقارب للتقاعد" tone="amber" onClick={() => setOpenReport(reports.retirement)} />
                {activePenCount > 0 && (
                  <AlertChip count={activePenCount} label="عقوبة نافذة" tone="destructive" onClick={() => setOpenReport(reports.penalties)} />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick preview cards */}
      <section className="rounded-3xl bg-card border border-border p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="size-5 text-amber" />
          <h3 className="font-extrabold text-lg">معاينة سريعة</h3>
          <span className="text-xs text-muted-foreground mr-auto">انقر على أي تقرير لعرضه قبل التصدير</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <PreviewCard report={reports.full} onOpen={setOpenReport} />
          <PreviewCard report={reports.employees} onOpen={setOpenReport} />
          <PreviewCard report={reports.promotions} onOpen={setOpenReport} badge={duePromCount} />
          <PreviewCard report={reports.increments} onOpen={setOpenReport} badge={dueIncCount} />
        </div>
      </section>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReportSection icon={TrendingUp} title="العلاوات والترقيات" tone="success">
          <ReportRow report={reports.increments} badge={dueIncCount} onOpen={setOpenReport} />
          <ReportRow report={reports.promotions} badge={duePromCount} onOpen={setOpenReport} />
        </ReportSection>

        <ReportSection icon={Users} title="تقارير الموظفين" tone="info">
          <ReportRow report={reports.employees} onOpen={setOpenReport} />
          <ReportRow report={reports.departments} onOpen={setOpenReport} />
        </ReportSection>

        <ReportSection icon={Calendar} title="الأحداث الإدارية" tone="amber">
          <ReportRow report={reports.commendations} onOpen={setOpenReport} />
          <ReportRow report={reports.penalties} onOpen={setOpenReport} />
        </ReportSection>

        <ReportSection icon={FileText} title="التقارير الإدارية" tone="primary">
          <ReportRow report={reports.full} onOpen={setOpenReport} />
          <ReportRow report={reports.seniority} onOpen={setOpenReport} />
          <ReportRow report={reports.retirement} badge={nearRetCount} onOpen={setOpenReport} />
        </ReportSection>
      </div>

      <ReportPreviewDialog report={openReport} onClose={() => setOpenReport(null)} />
    </div>
  );
}

function AlertChip({ count, label, tone, onClick }: { count: number; label: string; tone: Tone; onClick: () => void }) {
  if (count === 0) return null;
  const map: Record<Tone, string> = {
    success: "bg-success text-primary-foreground",
    primary: "gradient-primary text-primary-foreground",
    amber: "bg-amber text-amber-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    info: "bg-info text-primary-foreground",
  };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${map[tone]} hover:opacity-90 transition-smooth shadow-sm`}
    >
      <span className="bg-white/25 rounded-full size-6 flex items-center justify-center text-xs">{count}</span>
      {label}
    </button>
  );
}

function PreviewCard({ report, onOpen, badge }: { report: ReportData; onOpen: (r: ReportData) => void; badge?: number }) {
  const Icon = report.icon;
  return (
    <button
      onClick={() => onOpen(report)}
      className="group relative rounded-2xl border border-border bg-background hover:bg-primary hover:text-primary-foreground p-5 text-right transition-smooth hover:shadow-elegant hover:-translate-y-0.5"
    >
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-2 left-2 bg-amber text-amber-foreground text-xs font-bold rounded-full size-6 flex items-center justify-center shadow-md">
          {badge}
        </span>
      )}
      <Icon className="size-7 mb-3 text-primary group-hover:text-primary-foreground" />
      <div className="font-bold text-sm mb-1">{report.title}</div>
      <div className="text-xs opacity-70 line-clamp-2">{report.description}</div>
      <div className="flex items-center gap-1 text-xs mt-3 opacity-80 group-hover:opacity-100">
        <Eye className="size-3.5" /> معاينة
      </div>
    </button>
  );
}

function ReportSection({ icon: Icon, title, tone, children }: { icon: LucideIcon; title: string; tone: Tone; children: React.ReactNode }) {
  const map: Record<Tone, string> = {
    success: "bg-success",
    info: "bg-info",
    amber: "bg-amber",
    primary: "gradient-primary",
    destructive: "bg-destructive",
  };
  const text = tone === "amber" ? "text-amber-foreground" : "text-primary-foreground";
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-md">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <h3 className="font-bold">{title}</h3>
        <div className={`size-10 rounded-xl ${map[tone]} ${text} flex items-center justify-center`}>
          <Icon className="size-5" />
        </div>
      </div>
      <div className="p-3 space-y-2">{children}</div>
    </div>
  );
}

function ReportRow({ report, badge, onOpen }: { report: ReportData; badge?: number; onOpen: (r: ReportData) => void }) {
  const Icon = report.icon;
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-smooth">
      <div className="size-9 rounded-lg bg-muted flex items-center justify-center relative">
        <Icon className="size-4 text-foreground" />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -left-1 bg-amber text-amber-foreground text-[10px] font-bold rounded-full size-4 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{report.title}</div>
        <div className="text-xs text-muted-foreground truncate">{report.rows.length} سجل</div>
      </div>
      <Button size="sm" variant="outline" onClick={() => onOpen(report)} className="gap-1.5">
        <Eye className="size-3.5" /> معاينة
      </Button>
    </div>
  );
}

function ReportPreviewDialog({ report, onClose }: { report: ReportData | null; onClose: () => void }) {
  if (!report) return null;
  const r = report;
  const Icon = r.icon;
  const toneMap: Record<Tone, string> = {
    success: "bg-success text-primary-foreground",
    info: "bg-info text-primary-foreground",
    amber: "bg-amber text-amber-foreground",
    primary: "gradient-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };

  function handleExport() {
    if (!r.rows.length) {
      toast.error("لا توجد بيانات للتصدير");
      return;
    }
    const filename = `${r.key}-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(filename, r.columns, r.rows);
    toast.success("تم التصدير بنجاح", { description: filename });
  }

  return (
    <Dialog open={!!report} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-start gap-4">
            <div className={`size-12 rounded-2xl flex items-center justify-center shadow-md shrink-0 ${toneMap[report.tone]}`}>
              <Icon className="size-6" />
            </div>
            <div className="flex-1 min-w-0 text-right">
              <DialogTitle className="text-xl font-extrabold">{report.title}</DialogTitle>
              <DialogDescription className="text-sm mt-1">{report.description}</DialogDescription>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="size-3" /> {report.rows.length} سجل
                </Badge>
                <Badge variant="outline">{report.columns.length} عمود</Badge>
                <Badge variant="outline" className="gap-1">
                  <Calendar className="size-3" /> {formatDateAR(new Date())}
                </Badge>
              </div>
            </div>
          </div>
          {report.highlight && (
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber/10 border border-amber/30 p-3">
              <Bell className="size-4 text-amber shrink-0 mt-0.5" />
              <p className="text-sm text-foreground font-medium">{report.highlight}</p>
            </div>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[55vh]">
          <div className="p-6 pt-4">
            {report.rows.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <FileText className="size-12 mx-auto mb-3 opacity-40" />
                <p className="font-semibold">لا توجد بيانات لعرضها</p>
                <p className="text-xs mt-1">سيظهر التقرير هنا فور توفر السجلات</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      {report.columns.map((c) => (
                        <TableHead key={c} className="text-right font-bold text-foreground">{c}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.rows.map((row, i) => (
                      <TableRow key={i} className="hover:bg-muted/30">
                        {row.map((cell, j) => (
                          <TableCell key={j} className="text-right">
                            {String(cell) === "مستحقة" ? (
                              <Badge className="bg-success text-primary-foreground border-0">{cell}</Badge>
                            ) : String(cell) === "نعم" ? (
                              <Badge className="bg-destructive text-destructive-foreground border-0">{cell}</Badge>
                            ) : (
                              <span className="text-sm">{cell}</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 border-t border-border bg-muted/20 flex-row-reverse sm:flex-row-reverse gap-2">
          <Button onClick={handleExport} disabled={report.rows.length === 0} className="gradient-primary text-primary-foreground border-0 gap-2">
            <Download className="size-4" /> تصدير إلى CSV
          </Button>
          <Button variant="outline" onClick={onClose}>إغلاق</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
