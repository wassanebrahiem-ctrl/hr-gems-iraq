import { createFileRoute } from "@tanstack/react-router";
import { Award, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/StatCard";
import { useCommendationTypes } from "@/lib/data-init";
import type { CommendationLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/settings/commendations/")({
  component: CommendationsSettings,
});

const levelMap: Record<CommendationLevel, { label: string; color: string }> = {
  president: { label: "رئاسة جمهورية", color: "bg-destructive text-destructive-foreground" },
  pm: { label: "رئاسة وزراء", color: "bg-amber text-amber-foreground" },
  minister: { label: "وزاري", color: "bg-info text-info-foreground" },
  department: { label: "دائرة", color: "bg-muted text-muted-foreground" },
};

function CommendationsSettings() {
  const [types] = useCommendationTypes();

  return (
    <div className="space-y-6">
      <PageHeader icon={Award} title="كتب الشكر والتقدير" subtitle="إدارة أنواع كتب الشكر والتقدير وفق قانون انضباط موظفي الدولة رقم 14 لسنة 1991 - المادة 21" iconBg="gradient-amber" />

      <div className="rounded-2xl bg-info/10 border border-info/30 p-4 flex items-start gap-3">
        <BookOpen className="size-5 text-info shrink-0 mt-0.5" />
        <div className="text-sm">
          <div className="font-bold text-info">التفسير القانوني</div>
          <div className="text-foreground/80 mt-1">المادة 21 من قانون انضباط موظفي الدولة رقم 14 لسنة 1991 تنص على أن كتب الشكر تمنح الموظف قدماً إضافياً يحتسب لأغراض الترقية والعلاوة، ويختلف القدر الممنوح بحسب الجهة المانحة.</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Award} label="إجمالي أنواع كتب الشكر" value={types.length} tone="amber" />
        <StatCard icon={Award} label="كتب شكر" value={types.filter((t) => t.seniorityBonusMonths > 0).length} tone="info" />
        <StatCard icon={Award} label="تمنح قدماً" value={types.filter((t) => t.seniorityBonusMonths > 0).length} tone="success" />
        <StatCard icon={Award} label="أنواع فعّالة" value={types.filter((t) => t.active).length} tone="success" />
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="text-right px-4 py-3 font-semibold">#</th>
              <th className="text-right px-4 py-3 font-semibold">نوع كتاب الشكر</th>
              <th className="text-right px-4 py-3 font-semibold">المستوى</th>
              <th className="text-right px-4 py-3 font-semibold">القدم الممنوح</th>
              <th className="text-right px-4 py-3 font-semibold">الجهة المانحة</th>
              <th className="text-right px-4 py-3 font-semibold">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {types.map((t, i) => (
              <tr key={t.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 arabic-num text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground arabic-num">{t.code}</div>
                </td>
                <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-bold", levelMap[t.level].color)}>{levelMap[t.level].label}</span></td>
                <td className="px-4 py-3"><span className="font-bold text-amber arabic-num">{t.seniorityBonusMonths > 0 ? `+${t.seniorityBonusMonths} شهر` : "—"}</span></td>
                <td className="px-4 py-3"><span className="text-xs px-2.5 py-1 rounded-md bg-muted">{t.authority}</span></td>
                <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-bold", t.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>{t.active ? "فعّال" : "متوقف"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
