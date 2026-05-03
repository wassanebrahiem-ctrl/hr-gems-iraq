import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ClipboardList, Printer, Filter } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEmployees, useDepartments } from "@/lib/data-init";

export const Route = createFileRoute("/_app/reports/cadre/")({
  component: CadreReportPage,
});

function CadreReportPage() {
  const [employees] = useEmployees();
  const [departments] = useDepartments();
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active_only");

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      if (deptFilter !== "all" && e.departmentId !== deptFilter) return false;
      if (statusFilter === "active_only" && e.status !== "active") return false;
      return true;
    });
  }, [employees, deptFilter, statusFilter]);

  // Group: Grade -> JobTitle -> Gender -> [employees]
  const grouped = useMemo(() => {
    const map = new Map<number, Map<string, { male: typeof employees; female: typeof employees }>>();
    for (const e of filtered) {
      if (!map.has(e.grade)) map.set(e.grade, new Map());
      const titleMap = map.get(e.grade)!;
      if (!titleMap.has(e.jobTitle)) titleMap.set(e.jobTitle, { male: [], female: [] });
      const bucket = titleMap.get(e.jobTitle)!;
      if (e.gender === "male") bucket.male.push(e);
      else bucket.female.push(e);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([grade, titles]) => ({
        grade,
        titles: Array.from(titles.entries()).map(([jobTitle, gen]) => ({
          jobTitle,
          male: gen.male,
          female: gen.female,
          total: gen.male.length + gen.female.length,
        })),
      }));
  }, [filtered]);

  const grandTotal = filtered.length;
  const grandMale = filtered.filter((e) => e.gender === "male").length;
  const grandFemale = filtered.filter((e) => e.gender === "female").length;

  const deptName = deptFilter === "all"
    ? "جميع الأقسام"
    : departments.find((d) => d.id === deptFilter)?.name || "—";

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardList}
        title="تقرير ملاك الهيئة"
        subtitle="تقرير منظم حسب الدرجة الوظيفية والعنوان الوظيفي والجنس - قابل للطباعة"
        iconBg="gradient-primary"
        actions={
          <Button onClick={() => window.print()} className="gap-2 gradient-primary text-primary-foreground border-0">
            <Printer className="size-4" /> طباعة التقرير
          </Button>
        }
      />

      {/* Filters - hidden in print */}
      <div className="no-print rounded-2xl bg-card border border-border p-4 flex flex-wrap items-end gap-4">
        <Filter className="size-5 text-muted-foreground mb-2" />
        <div className="min-w-48">
          <Label className="mb-1 block text-xs">القسم</Label>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأقسام</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-48">
          <Label className="mb-1 block text-xs">نوع الخدمة</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active_only">الملاك الدائم فقط</SelectItem>
              <SelectItem value="all">جميع الحالات</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mr-auto text-sm text-muted-foreground arabic-num">
          إجمالي: <strong className="text-foreground">{grandTotal}</strong> موظف
          (ذكور: <strong className="text-foreground">{grandMale}</strong>،
          إناث: <strong className="text-foreground">{grandFemale}</strong>)
        </div>
      </div>

      {/* Printable area */}
      <div className="print-area bg-white text-black rounded-2xl border border-border p-8 shadow-md">
        {/* Header */}
        <div className="text-center mb-6 border-b-2 border-black pb-4">
          <h1 className="text-2xl font-extrabold">تقرير الملاك</h1>
          <div className="text-sm mt-2 flex justify-center gap-6 arabic-num">
            <span>القسم: {deptName}</span>
            <span>التاريخ: {new Date().toLocaleDateString("ar-IQ")}</span>
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black px-2 py-2 w-24 text-center font-bold">الدرجة الوظيفية</th>
              <th className="border border-black px-2 py-2 w-56 text-right font-bold">العنوان الوظيفي</th>
              <th className="border border-black px-2 py-2 w-20 text-center font-bold">الجنس</th>
              <th className="border border-black px-2 py-2 text-right font-bold">الاسم الثلاثي واللقب</th>
            </tr>
          </thead>
          <tbody>
            {grouped.map((g) => {
              const gradeTotal = g.titles.reduce((s, t) => s + t.total, 0);
              const gradeMale = g.titles.reduce((s, t) => s + t.male.length, 0);
              const gradeFemale = g.titles.reduce((s, t) => s + t.female.length, 0);
              return (
                <GradeBlock
                  key={g.grade}
                  grade={g.grade}
                  titles={g.titles}
                  gradeTotal={gradeTotal}
                  gradeMale={gradeMale}
                  gradeFemale={gradeFemale}
                />
              );
            })}

            {/* Grand total */}
            <tr className="bg-gray-300 font-extrabold">
              <td colSpan={3} className="border border-black px-2 py-2 text-right">
                المجموع الكلي للموظفين
              </td>
              <td className="border border-black px-2 py-2 text-center arabic-num">
                {grandTotal} (ذكور: {grandMale}، إناث: {grandFemale})
              </td>
            </tr>

            {grouped.length === 0 && (
              <tr>
                <td colSpan={4} className="border border-black px-4 py-8 text-center text-gray-500">
                  لا توجد بيانات للعرض
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-8 grid grid-cols-2 gap-8 text-sm">
          <div className="text-center">
            <div className="border-t border-black pt-2 mt-12 mx-auto w-48">
              معد التقرير
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2 mt-12 mx-auto w-48">
              مدير الموارد البشرية
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 1cm; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; inset: 0; box-shadow: none !important; border: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}

interface TitleGroup {
  jobTitle: string;
  male: { id: string; fullName: string }[];
  female: { id: string; fullName: string }[];
  total: number;
}

function GradeBlock({
  grade, titles, gradeTotal, gradeMale, gradeFemale,
}: {
  grade: number;
  titles: TitleGroup[];
  gradeTotal: number;
  gradeMale: number;
  gradeFemale: number;
}) {
  return (
    <>
      {/* Grade header row */}
      <tr>
        <td className="border border-black bg-green-200 text-center font-extrabold text-lg arabic-num py-2" rowSpan={1}>
          {grade}
        </td>
        <td className="border border-black bg-gray-50" colSpan={3}></td>
      </tr>

      {titles.map((t) => {
        const totalRows = Math.max(1, t.male.length) + Math.max(1, t.female.length) + 1; // +1 for title row
        return (
          <TitleBlock key={t.jobTitle} title={t} />
        );
      })}

      {/* Subtotals for this grade */}
      <tr className="bg-gray-200 font-bold">
        <td className="border border-black px-2 py-1.5 text-right" colSpan={3}>
          المجموع حسب الدرجة الوظيفية ({grade})
        </td>
        <td className="border border-black px-2 py-1.5 text-center arabic-num">
          {gradeTotal} (ذكور: {gradeMale}، إناث: {gradeFemale})
        </td>
      </tr>
    </>
  );
}

function TitleBlock({ title }: { title: TitleGroup }) {
  return (
    <>
      {/* Job title header */}
      <tr>
        <td className="border border-black bg-yellow-200"></td>
        <td className="border border-black bg-yellow-200 px-2 py-1.5 text-right font-bold" colSpan={3}>
          {title.jobTitle}
        </td>
      </tr>

      {/* Males */}
      {title.male.length > 0 && (
        <>
          <tr>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black bg-blue-500 text-white text-center font-bold py-1" rowSpan={title.male.length + 1}>
              ذكر
            </td>
            <td className="border border-black"></td>
          </tr>
          {title.male.map((emp) => (
            <tr key={emp.id}>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black px-2 py-1.5 text-right">{emp.fullName}</td>
            </tr>
          ))}
        </>
      )}

      {/* Females */}
      {title.female.length > 0 && (
        <>
          <tr>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black bg-pink-400 text-white text-center font-bold py-1" rowSpan={title.female.length + 1}>
              أنثى
            </td>
            <td className="border border-black"></td>
          </tr>
          {title.female.map((emp) => (
            <tr key={emp.id}>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black px-2 py-1.5 text-right">{emp.fullName}</td>
            </tr>
          ))}
        </>
      )}

      {/* Subtotal by gender for this title */}
      <tr className="bg-gray-100">
        <td className="border border-black"></td>
        <td className="border border-black px-2 py-1 text-right text-xs" colSpan={2}>
          المجموع حسب الجنس (ذكور / إناث)
        </td>
        <td className="border border-black px-2 py-1 text-center arabic-num text-xs">
          {title.male.length} / {title.female.length}
        </td>
      </tr>
      {/* Subtotal by job title */}
      <tr className="bg-gray-100">
        <td className="border border-black"></td>
        <td className="border border-black px-2 py-1 text-right text-xs" colSpan={2}>
          المجموع حسب العنوان الوظيفي
        </td>
        <td className="border border-black px-2 py-1 text-center arabic-num text-xs font-bold">
          {title.total}
        </td>
      </tr>
    </>
  );
}
