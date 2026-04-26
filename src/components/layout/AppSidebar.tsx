import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, FileText, BarChart3, UserCircle,
  Briefcase, Building2, DollarSign, CalendarDays, AlertTriangle,
  Award, Database, Settings, Sparkles, Crown, ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    label: "الرئيسية",
    items: [
      { title: "لوحة التحكم", to: "/", icon: LayoutDashboard },
      { title: "الموظفون", to: "/employees", icon: Users },
      { title: "التقارير", to: "/reports", icon: FileText },
      { title: "تقرير ملاك الهيئة", to: "/reports/cadre", icon: ClipboardList },
      { title: "الإحصائيات", to: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "الإعدادات",
    items: [
      { title: "العناوين الوظيفية", to: "/settings/job-titles", icon: Briefcase },
      { title: "المناصب الإدارية", to: "/settings/positions", icon: Crown },
      { title: "الأقسام", to: "/settings/departments", icon: Building2 },
      { title: "سلم الرواتب", to: "/settings/salary", icon: DollarSign },
      { title: "أنواع الإجازات", to: "/settings/leaves", icon: CalendarDays },
      { title: "أنواع العقوبات", to: "/settings/penalties", icon: AlertTriangle },
      { title: "كتب الشكر", to: "/settings/commendations", icon: Award },
      { title: "مصادر القواعد", to: "/settings/legal", icon: Database },
    ],
  },
  {
    label: "النظام",
    items: [
      { title: "تفضيلات النظام", to: "/settings/preferences", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const loc = useLocation();
  const isActive = (path: string) => path === "/" ? loc.pathname === "/" : loc.pathname.startsWith(path);

  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-l border-sidebar-border">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="size-11 rounded-2xl gradient-amber flex items-center justify-center shadow-glow group-hover:scale-105 transition-smooth">
            <Sparkles className="size-5 text-amber-foreground" />
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-lg leading-tight">هيئة استثمار بغداد</div>
            <div className="text-xs text-sidebar-foreground/60">إدارة الموارد البشرية</div>
          </div>
        </Link>
      </div>

      {/* User mini */}
      <div className="mx-4 mt-4 mb-2 rounded-2xl bg-sidebar-accent/60 border border-sidebar-border p-3 flex items-center gap-3">
        <div className="size-10 rounded-xl bg-gradient-to-br from-amber to-amber/70 flex items-center justify-center text-amber-foreground font-bold">
          م
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">مستخدم النظام</div>
          <div className="text-[11px] text-sidebar-foreground/60">مدير المنظومة</div>
        </div>
        <UserCircle className="size-5 text-sidebar-foreground/50" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-sidebar-foreground/40">
              {g.label}
            </div>
            <ul className="space-y-1">
              {g.items.map((it) => {
                const active = isActive(it.to);
                return (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth relative group",
                        active
                          ? "bg-amber text-amber-foreground shadow-md"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      <it.icon className={cn("size-[18px] shrink-0", active ? "" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground")} />
                      <span className="flex-1 truncate">{it.title}</span>
                      {active && <span className="size-1.5 rounded-full bg-amber-foreground/70" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-xl gradient-primary p-3 text-center">
          <div className="text-xs font-bold text-primary-foreground">v1.0 · بياناتك محلية</div>
          <div className="text-[10px] text-primary-foreground/70 mt-0.5">جميع البيانات محفوظة في متصفحك</div>
        </div>
      </div>
    </aside>
  );
}
