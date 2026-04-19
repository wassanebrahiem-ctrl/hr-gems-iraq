import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  tone?: "primary" | "amber" | "success" | "warning" | "info" | "destructive";
}

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, { bg: string; text: string; ring: string }> = {
  primary:     { bg: "bg-primary/10",     text: "text-primary",     ring: "ring-primary/20" },
  amber:       { bg: "bg-amber/15",       text: "text-amber",       ring: "ring-amber/30" },
  success:     { bg: "bg-success/10",     text: "text-success",     ring: "ring-success/20" },
  warning:     { bg: "bg-warning/15",     text: "text-warning",     ring: "ring-warning/30" },
  info:        { bg: "bg-info/10",        text: "text-info",        ring: "ring-info/20" },
  destructive: { bg: "bg-destructive/10", text: "text-destructive", ring: "ring-destructive/20" },
};

export function StatCard({ icon: Icon, label, value, hint, tone = "primary" }: StatCardProps) {
  const t = toneClasses[tone];
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-5 hover:shadow-elegant transition-smooth hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className={cn("size-12 rounded-xl flex items-center justify-center ring-4", t.bg, t.ring)}>
          <Icon className={cn("size-6", t.text)} />
        </div>
        <div className="text-right">
          <div className={cn("text-3xl font-extrabold arabic-num leading-none", t.text)}>{value}</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      <div className={cn("absolute -bottom-12 -left-12 size-32 rounded-full opacity-20 blur-2xl", t.bg)} />
    </div>
  );
}
