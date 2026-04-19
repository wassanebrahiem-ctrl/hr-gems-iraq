import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart, Users, ArrowUp, TrendingUp, Award, AlertTriangle, FileText, Calendar, BarChart3, Download, Zap } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useEmployees, useDepartments, usePenaltyRecords, usePenaltyTypes, useCommendationRecords, useCommendationTypes, useLeaveRecords, useLeaveTypes } from "@/lib/data-init";
import { incrementStatus, promotionStatus, formatDateAR } from "@/lib/calc";

export const Route = createFileRoute("/_app/reports/")({
  component: Reports,
});

function downloadCSV(filename: string, rows: string[][]) {
  const csv = "\uFEFF" + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function Reports() {
  const [employees] = useEmployees();
  const [departments] = useDepartments();
  const [penalties] = usePenaltyRecords();
  const [penaltyTypes] = usePenaltyTypes();
  const [commendations] = useCommendationRecords();
  const [commendationTypes] = useCommendationTypes();
  const [leaves] = useLeaveRecords();
  const [leaveTypes] = useLeaveTypes();

  function expEmployees() {
    const rows = [["الرقم", "الاسم", "القسم", "العنوان الوظيفي", "الدرجة", "المرحلة", "تاريخ المباشرة", "الحالة"]];
    employees.forEach((e) => {
      const d = departments.find((x) => x.id === e.departmentId);
      rows.push([e.empNo, e.fullName, d?.name || "", e.jobTitle, String(e.grade), String(e.stage), e.startDate, e.status]);
    });
    downloadCSV(`employees-${new Date().toISOString().slice(0,10)}.csv`, rows);
  }

  function expIncrements() {
    const rows = [["الرقم", "الاسم", "آخر علاوة", "أشهر منذ آخر علاوة", "الحالة"]];
    employees.forEach((e) => {
      const s = incrementStatus(e);
      if (s.due) rows.push([e.empNo, e.fullName, e.lastIncrementDate || "", String(s.monthsSinceLast), "مستحقة"]);
    });
    downloadCSV("due-increments.csv", rows);
  }

  function expPromotions() {
    const rows = [["الرقم", "الاسم", "الدرجة", "آخر ترقية", "أشهر التأخير", "أشهر الإضافة"]];
    employees.forEach((e) => {
      const s = promotionStatus(e, penalties, penaltyTypes, commendations, commendationTypes);
      if (s.due) rows.push([e.empNo, e.fullName, String(e.grade), e.lastPromotionDate || e.startDate, String(s.delayMonths), String(s.bonusMonths)]);
    });
    downloadCSV("due-promotions.csv", rows);
  }

  function expPenalties() {
    const rows = [["الرقم", "الاسم", "نوع العقوبة", "التاريخ", "السبب", "نشطة"]];
    penalties.forEach((p) => {
      const e = employees.find((x) => x.id === p.employeeId);
      const t = penaltyTypes.find((x) => x.id === p.penaltyTypeId);
      rows.push([e?.empNo || "", e?.fullName || "", t?.name || "", p.date, p.reason, p.active ? "نعم" : "لا"]);
    });
    downloadCSV("penalties.csv", rows);
  }

  function expCommend() {
    const rows = [["الرقم", "الاسم", "نوع الكتاب", "التاريخ", "القدم الممنوح"]];
    commendations.forEach((c) => {
      const e = employees.find((x) => x.id === c.employeeId);
      const t = commendationTypes.find((x) => x.id === c.commendationTypeId);
      rows.push([e?.empNo || "", e?.fullName || "", t?.name || "", c.date, String(t?.seniorityBonusMonths || 0)]);
    });
    downloadCSV("commendations.csv", rows);
  }

  function expDept() {
    const rows = [["القسم", "عدد الموظفين"]];
    departments.forEach((d) => rows.push([d.name, String(employees.filter((e) => e.departmentId === d.id).length)]));
    downloadCSV("by-department.csv", rows);
  }

  function expFull() {
    const rows = [["#", "الرقم الوظيفي", "الاسم", "القسم", "العنوان", "الدرجة/المرحلة", "تاريخ المباشرة", "حالة العلاوة", "حالة الترقية", "العقوبات", "كتب الشكر"]];
    employees.forEach((e, i) => {
      const d = departments.find((x) => x.id === e.departmentId);
      const inc = incrementStatus(e);
      const pr = promotionStatus(e, penalties, penaltyTypes, commendations, commendationTypes);
      const pCount = penalties.filter((p) => p.employeeId === e.id).length;
      const cCount = commendations.filter((c) => c.employeeId === e.id).length;
      rows.push([String(i + 1), e.empNo, e.fullName, d?.name || "", e.jobTitle, `${e.grade}/${e.stage}`, e.startDate, inc.due ? "مستحقة" : `بعد ${inc.monthsRemaining} شهر`, pr.due ? "مستحقة" : `بعد ${pr.monthsRemaining} شهر`, String(pCount), String(cCount)]);
    });
    downloadCSV("full-report.csv", rows);
  }

  return (
    <div className="space-y-6">
      <PageHeader icon={FileBarChart} title="مركز التقارير" subtitle="إنشاء وتصدير جميع أنواع التقارير بصيغة CSV المتوافقة مع Excel مع تخصيص الأعمدة ومراجعة البيانات" iconBg="gradient-primary" />

      {/* Quick export */}
      <section className="rounded-3xl bg-card border border-border p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="size-5 text-amber" />
          <h3 className="font-extrabold text-lg">تصدير سريع</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <ExportCard icon={FileText} title="تقرير شامل" desc="ملخص شامل للنظام" onClick={expFull} />
          <ExportCard icon={Users} title="قائمة الموظفين" desc="جميع الموظفين النشطين" onClick={expEmployees} />
          <ExportCard icon={TrendingUp} title="المستحقين للترقية" desc="معالج متكامل مع تخصيص الأعمدة" onClick={expPromotions} />
          <ExportCard icon={ArrowUp} title="المستحقين للعلاوة" desc="معالج متكامل مع تخصيص الأعمدة" onClick={expIncrements} />
        </div>
      </section>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReportSection icon={TrendingUp} title="تقارير العلاوات والترقيات" tone="success">
          <ReportRow icon={ArrowUp} label="العلاوات المستحقة" desc="معالج متكامل مع تخصيص الأعمدة" onClick={expIncrements} />
          <ReportRow icon={TrendingUp} label="الترقيات المستحقة" desc="معالج متكامل مع تخصيص الأعمدة" onClick={expPromotions} />
        </ReportSection>

        <ReportSection icon={Users} title="تقارير الموظفين" tone="info">
          <ReportRow icon={Users} label="قائمة الموظفين" desc="معالج متكامل مع تخصيص الأعمدة" onClick={expEmployees} />
          <ReportRow icon={BarChart3} label="توزيع الأقسام" desc="الموظفين حسب القسم" onClick={expDept} />
        </ReportSection>

        <ReportSection icon={Calendar} title="تقارير الأحداث" tone="amber">
          <ReportRow icon={Award} label="كتب الشكر" desc="جميع كتب الشكر" onClick={expCommend} />
          <ReportRow icon={AlertTriangle} label="العقوبات" desc="جميع العقوبات النافذة" onClick={expPenalties} />
        </ReportSection>

        <ReportSection icon={FileText} title="التقارير الإدارية" tone="primary">
          <ReportRow icon={FileText} label="تقرير شامل" desc="جميع البيانات في ملف واحد" onClick={expFull} />
          <ReportRow icon={TrendingUp} label="تأثير الأقدمية" desc="الموظفين المتأثرين بالأحداث" onClick={() => {
            const rows = [["الاسم", "العقوبات", "كتب الشكر", "صافي القدم"]];
            employees.forEach((e) => {
              const dly = penalties.filter((p) => p.employeeId === e.id && p.active).reduce((s, p) => s + (penaltyTypes.find((x) => x.id === p.penaltyTypeId)?.promotionDelayMonths || 0), 0);
              const bns = commendations.filter((c) => c.employeeId === e.id).reduce((s, c) => s + (commendationTypes.find((x) => x.id === c.commendationTypeId)?.seniorityBonusMonths || 0), 0);
              rows.push([e.fullName, String(dly), String(bns), String(bns - dly)]);
            });
            downloadCSV("seniority-impact.csv", rows);
          }} />
        </ReportSection>
      </div>
    </div>
  );
}

function ExportCard({ icon: Icon, title, desc, onClick }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group rounded-2xl border border-border bg-background hover:bg-primary hover:text-primary-foreground p-5 text-center transition-smooth hover:shadow-elegant hover:-translate-y-0.5">
      <Icon className="size-8 mx-auto mb-3 text-primary group-hover:text-primary-foreground" />
      <div className="font-bold text-sm">{title}</div>
      <div className="text-xs opacity-70 mt-1">{desc}</div>
    </button>
  );
}

function ReportSection({ icon: Icon, title, tone, children }: { icon: React.ComponentType<{ className?: string }>; title: string; tone: "success" | "info" | "amber" | "primary"; children: React.ReactNode }) {
  const map = { success: "bg-success", info: "bg-info", amber: "bg-amber", primary: "gradient-primary" }[tone];
  const text = tone === "amber" ? "text-amber-foreground" : "text-primary-foreground";
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-md">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <h3 className="font-bold">{title}</h3>
        <div className={`size-10 rounded-xl ${map} ${text} flex items-center justify-center`}><Icon className="size-5" /></div>
      </div>
      <div className="p-3 space-y-2">{children}</div>
    </div>
  );
}

function ReportRow({ icon: Icon, label, desc, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; desc: string; onClick: () => void }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-smooth">
      <div className="size-9 rounded-lg bg-muted flex items-center justify-center"><Icon className="size-4 text-foreground" /></div>
      <div className="flex-1">
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Button size="sm" onClick={onClick} className="gradient-primary text-primary-foreground border-0 gap-1.5"><Download className="size-3.5" /> تصدير</Button>
    </div>
  );
}
