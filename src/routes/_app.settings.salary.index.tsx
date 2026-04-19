import { createFileRoute } from "@tanstack/react-router";
import { DollarSign } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSalary } from "@/lib/data-init";
import { formatIQD } from "@/lib/calc";

export const Route = createFileRoute("/_app/settings/salary/")({
  component: SalaryPage,
});

function SalaryPage() {
  const [salary] = useSalary();

  return (
    <div className="space-y-6">
      <PageHeader icon={DollarSign} title="سلم الرواتب" subtitle="وفق قانون رواتب موظفي الدولة رقم 22 لسنة 2008 — الراتب الأساسي حسب الدرجة والمرحلة" iconBg="gradient-amber" />

      <div className="rounded-2xl bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="text-right px-4 py-3 font-semibold sticky right-0 bg-muted/40">الدرجة \\ المرحلة</th>
              {Array.from({ length: 10 }, (_, i) => (
                <th key={i} className="text-center px-3 py-3 font-semibold arabic-num">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {salary.map((g) => (
              <tr key={g.grade} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-bold sticky right-0 bg-card">
                  <span className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground arabic-num">الدرجة {g.grade}</span>
                </td>
                {g.stages.map((s, i) => (
                  <td key={i} className="text-center px-3 py-3 arabic-num text-xs whitespace-nowrap">
                    {formatIQD(s)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl bg-info/10 border border-info/30 p-4 text-sm text-foreground/80">
        <strong className="text-info">ملاحظة:</strong> القيم المعروضة تقريبية لأغراض العرض. للقيم الرسمية يرجى الرجوع إلى تعليمات وزارة المالية النافذة.
      </div>
    </div>
  );
}
