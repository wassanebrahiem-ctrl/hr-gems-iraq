import { createFileRoute } from "@tanstack/react-router";
import { DollarSign } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSalary } from "@/lib/data-init";
import { formatIQD } from "@/lib/calc";

export const Route = createFileRoute("/_app/settings/salary/")({
  component: SalaryPage,
});

const STAGES = 11;

function SalaryPage() {
  const [salary] = useSalary();

  return (
    <div className="space-y-6">
      <PageHeader
        icon={DollarSign}
        title="سلم رواتب الموظفين"
        subtitle="وفق قانون رواتب موظفي الدولة رقم 22 لسنة 2008 — الراتب الأساسي حسب الدرجة والمرحلة"
        iconBg="gradient-amber"
      />

      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gradient-to-l from-primary/15 via-primary/10 to-primary/5 text-foreground">
                <th rowSpan={2} className="text-center px-3 py-3 font-bold border border-border sticky right-0 bg-card/95 backdrop-blur z-10 min-w-[110px]">
                  الدرجة الوظيفية
                </th>
                <th colSpan={STAGES} className="text-center px-3 py-2 font-bold border border-border tracking-widest">
                  سنــــــــوات الخدمــــــــة
                </th>
                <th rowSpan={2} className="text-center px-3 py-3 font-bold border border-border bg-amber-500/15 text-amber-900 dark:text-amber-200 min-w-[100px]">
                  العلاوة السنوية
                </th>
                <th rowSpan={2} className="text-center px-3 py-3 font-bold border border-border bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 min-w-[110px]">
                  عدد سنوات الخدمة لكل علاوة
                </th>
              </tr>
              <tr className="bg-muted/40 text-xs">
                {Array.from({ length: STAGES }, (_, i) => (
                  <th key={i} className="text-center px-2 py-2 font-bold border border-border arabic-num min-w-[88px]">
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salary.map((g) => (
                <tr key={g.grade} className="hover:bg-primary/5 transition-colors">
                  <td className="text-center px-3 py-3 font-bold border border-border sticky right-0 bg-card z-10">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground arabic-num shadow-sm">
                      {g.grade}
                    </span>
                  </td>
                  {g.stages.slice(0, STAGES).map((s, i) => {
                    const isMid = i === 4; // مرحلة 5 مظللة في الأصل
                    return (
                      <td
                        key={i}
                        className={`text-center px-2 py-3 border border-border arabic-num font-medium whitespace-nowrap ${isMid ? "bg-muted/60 font-bold" : ""}`}
                      >
                        {formatIQD(s)}
                      </td>
                    );
                  })}
                  <td className="text-center px-3 py-3 border border-border arabic-num font-bold bg-amber-500/10 text-amber-900 dark:text-amber-200 whitespace-nowrap">
                    {formatIQD(g.annualIncrement)}
                  </td>
                  <td className="text-center px-3 py-3 border border-border arabic-num font-bold bg-emerald-500/10 text-emerald-900 dark:text-emerald-200">
                    {g.yearsPerIncrement}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl bg-info/10 border border-info/30 p-4 text-sm text-foreground/80 leading-relaxed">
        <strong className="text-info">ملاحظة:</strong> القيم مأخوذة من جدول سلم رواتب موظفي الدولة وفق قانون رقم 22 لسنة 2008.
        المرحلة الخامسة مظللة كمرحلة مرجعية. للقيم الرسمية المعدّلة يرجى الرجوع إلى تعليمات وزارة المالية النافذة.
      </div>
    </div>
  );
}
