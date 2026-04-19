import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  iconBg?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ icon: Icon, title, subtitle, iconBg = "gradient-primary", actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className={cn("size-14 rounded-2xl flex items-center justify-center shadow-elegant shrink-0", iconBg)}>
            <Icon className="size-7 text-primary-foreground" />
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
