import { createFileRoute } from "@tanstack/react-router";
import { Database, ScrollText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/_app/settings/legal/")({
  component: LegalPage,
});

const laws = [
  { num: "24", year: "1960", title: "قانون الخدمة المدنية", scope: "ينظم شؤون الموظفين المدنيين وحقوقهم وواجباتهم والإجازات والتأديب", color: "bg-info" },
  { num: "25", year: "1960", title: "قانون الملاك", scope: "ينظم درجات الموظفين والترقية بين الدرجات الوظيفية والمدد المعتمدة", color: "bg-primary" },
  { num: "22", year: "2008", title: "قانون رواتب موظفي الدولة", scope: "يحدد سلم الرواتب الأساسية حسب الدرجة والمرحلة والعلاوة السنوية", color: "bg-amber" },
  { num: "14", year: "1991", title: "قانون انضباط موظفي الدولة", scope: "ينظم العقوبات الانضباطية وكتب الشكر وتأثيرها على القدم والترقية", color: "bg-destructive" },
  { num: "9",  year: "2014", title: "قانون التقاعد الموحد", scope: "يحدد سن التقاعد القانوني واحتساب الخدمة لأغراض التقاعد", color: "bg-warning" },
  { num: "37", year: "2015", title: "قانون العمل", scope: "ينظم علاقات العمل في القطاع الخاص بما فيها إجازات الأمومة والمرضية", color: "bg-success" },
];

function LegalPage() {
  return (
    <div className="space-y-6">
      <PageHeader icon={Database} title="مصادر القواعد القانونية" subtitle="القوانين العراقية المعتمدة في عمليات الحساب والتطبيق داخل النظام" iconBg="gradient-primary" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {laws.map((l) => (
          <div key={l.num + l.year} className="rounded-2xl bg-card border border-border p-6 hover:shadow-elegant transition-smooth">
            <div className="flex items-start gap-4">
              <div className={`size-14 rounded-2xl ${l.color} text-white flex flex-col items-center justify-center font-extrabold shadow-md`}>
                <div className="text-lg leading-none arabic-num">{l.num}</div>
                <div className="text-[10px] opacity-80 arabic-num">{l.year}</div>
              </div>
              <div className="flex-1">
                <div className="font-bold text-base">{l.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5 arabic-num">رقم {l.num} لسنة {l.year}</div>
                <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{l.scope}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-2 mb-3">
          <ScrollText className="size-5 text-amber" />
          <h3 className="font-bold">إخلاء مسؤولية</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          النظام يعتمد على القوانين العراقية المذكورة لإجراء الحسابات والتنبيهات. قد تطرأ تعديلات تشريعية، ويجب الرجوع دوماً إلى النصوص الرسمية النافذة وتعليمات الوزارات المختصة قبل اتخاذ أي قرار إداري نهائي.
        </p>
      </div>
    </div>
  );
}
