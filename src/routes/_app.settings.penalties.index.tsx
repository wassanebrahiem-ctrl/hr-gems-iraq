import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/StatCard";
import { usePenaltyTypes } from "@/lib/data-init";
import type { PenaltySeverity } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/settings/penalties/")({
  component: PenaltiesSettings,
});

const severityMap: Record<PenaltySeverity, { label: string; color: string }> = {
  light: { label: "خفيفة", color: "bg-success/15 text-success" },
  medium: { label: "متوسطة", color: "bg-warning/15 text-warning" },
  severe: { label: "شديدة", color: "bg-destructive/15 text-destructive" },
  extreme: { label: "قصوى", color: "bg-destructive text-destructive-foreground" },
};

function PenaltiesSettings() {
  const [types] = usePenaltyTypes();
  const [filter, setFilter] = useState<"all" | PenaltySeverity>("all");

  const counts = {
    all: types.length,
    light: types.filter((t) => t.severity === "light").length,
    medium: types.filter((t) => t.severity === "medium").length,
    severe: types.filter((t) => t.severity === "severe").length,
    extreme: types.filter((t) => t.severity === "extreme").length,
  };

  const filtered = filter === "all" ? types : types.filter((t) => t.severity === filter);

  return (
    <div className="space-y-6">
      <PageHeader icon={AlertTriangle} title="قائمة أنواع العقوبات" subtitle="وفق قانون انضباط موظفي الدولة رقم 14 لسنة 1991" iconBg="bg-destructive" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={AlertTriangle} label="إجمالي أنواع العقوبات" value={counts.all} tone="destructive" />
        <StatCard icon={ShieldAlert} label="عقوبات خفيفة/متوسطة" value={counts.light + counts.medium} tone="warning" />
        <StatCard icon={ShieldX} label="عقوبات شديدة/قصوى" value={counts.severe + counts.extreme} tone="destructive" />
        <StatCard icon={ShieldCheck} label="عقوبات فعّالة" value={types.filter((t) => t.active).length} tone="success" />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "light", "medium", "severe", "extreme"] as const).map((k) => (
          <button key={k} onClick={() => setFilter(k)} className={cn("px-3 py-1.5 rounded-full text-xs font-bold border transition-smooth", filter === k ? "bg-primary text-primary-foreground border-transparent" : "bg-background border-border text-muted-foreground hover:bg-muted/50")}>
            {k === "all" ? "الكل" : severityMap[k].label} ({k === "all" ? counts.all : counts[k]})
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="text-right px-4 py-3 font-semibold">#</th>
              <th className="text-right px-4 py-3 font-semibold">العقوبة</th>
              <th className="text-right px-4 py-3 font-semibold">الشدة</th>
              <th className="text-right px-4 py-3 font-semibold">تأخير الترقية</th>
              <th className="text-right px-4 py-3 font-semibold">الجهة المختصة</th>
              <th className="text-right px-4 py-3 font-semibold">المرجع القانوني</th>
              <th className="text-right px-4 py-3 font-semibold">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((t, i) => (
              <tr key={t.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 arabic-num text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground arabic-num">{t.code}</div>
                </td>
                <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-bold", severityMap[t.severity].color)}>{severityMap[t.severity].label}</span></td>
                <td className="px-4 py-3 arabic-num font-semibold">{t.promotionDelayMonths > 0 ? `${t.promotionDelayMonths} شهر` : "—"}</td>
                <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-md bg-info/10 text-info text-xs font-semibold">{t.authority}</span></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{t.legalRef}</td>
                <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-bold", t.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>{t.active ? "فعّال" : "متوقف"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
