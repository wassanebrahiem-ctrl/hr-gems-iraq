import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useEmployees, useDepartments, usePenaltyRecords, useCommendationRecords } from "@/lib/data-init";

export const Route = createFileRoute("/_app/analytics/")({
  component: Analytics,
});

function Analytics() {
  const [employees] = useEmployees();
  const [departments] = useDepartments();
  const [penalties] = usePenaltyRecords();
  const [commendations] = useCommendationRecords();

  const byDept = useMemo(() => departments.map((d) => ({
    name: d.name,
    count: employees.filter((e) => e.departmentId === d.id).length,
  })), [departments, employees]);

  const maxDept = Math.max(1, ...byDept.map((x) => x.count));

  const byGrade = useMemo(() => {
    const map = new Map<number, number>();
    employees.forEach((e) => map.set(e.grade, (map.get(e.grade) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [employees]);

  const byGender = useMemo(() => {
    const m = employees.filter((e) => e.gender === "male").length;
    const f = employees.filter((e) => e.gender === "female").length;
    return { m, f, total: m + f };
  }, [employees]);

  return (
    <div className="space-y-6">
      <PageHeader icon={BarChart3} title="الإحصائيات" subtitle="رؤى تحليلية حول هيكل المنظومة وتوزيع الموظفين" iconBg="gradient-amber" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-card border border-border p-6 shadow-md">
          <h3 className="font-bold mb-5">التوزيع حسب القسم</h3>
          <div className="space-y-3">
            {byDept.map((d) => (
              <div key={d.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{d.name}</span>
                  <span className="font-bold arabic-num">{d.count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-primary rounded-full transition-smooth" style={{ width: `${(d.count / maxDept) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 shadow-md">
          <h3 className="font-bold mb-5">التوزيع حسب الدرجة</h3>
          <div className="grid grid-cols-5 gap-2 h-48 items-end">
            {byGrade.map(([grade, count]) => {
              const max = Math.max(1, ...byGrade.map((g) => g[1]));
              return (
                <div key={grade} className="flex flex-col items-center gap-2">
                  <div className="text-xs font-bold arabic-num">{count}</div>
                  <div className="w-full rounded-t-lg gradient-amber transition-smooth" style={{ height: `${(count / max) * 100}%`, minHeight: "8px" }} />
                  <div className="text-xs text-muted-foreground arabic-num">د{grade}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 shadow-md">
          <h3 className="font-bold mb-5">التوزيع حسب الجنس</h3>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="size-24 mx-auto rounded-full bg-info/15 flex items-center justify-center text-3xl font-extrabold text-info arabic-num">{byGender.m}</div>
              <div className="mt-2 text-sm font-semibold">ذكور</div>
              <div className="text-xs text-muted-foreground arabic-num">{Math.round((byGender.m / byGender.total) * 100)}%</div>
            </div>
            <div className="text-center">
              <div className="size-24 mx-auto rounded-full bg-amber/20 flex items-center justify-center text-3xl font-extrabold text-amber arabic-num">{byGender.f}</div>
              <div className="mt-2 text-sm font-semibold">إناث</div>
              <div className="text-xs text-muted-foreground arabic-num">{Math.round((byGender.f / byGender.total) * 100)}%</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 shadow-md">
          <h3 className="font-bold mb-5">ملخص الأحداث</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-destructive/10">
              <div className="text-3xl font-extrabold text-destructive arabic-num">{penalties.length}</div>
              <div className="text-xs text-destructive/80 mt-1 font-semibold">إجمالي العقوبات</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-success/10">
              <div className="text-3xl font-extrabold text-success arabic-num">{commendations.length}</div>
              <div className="text-xs text-success/80 mt-1 font-semibold">إجمالي كتب الشكر</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
