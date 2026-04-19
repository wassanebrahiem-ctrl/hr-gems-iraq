import { createFileRoute } from "@tanstack/react-router";
import { Settings, Download, Upload, Trash2, Database } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { exportAllData, importAllData, clearAllData } from "@/lib/storage";
import { useRef } from "react";

export const Route = createFileRoute("/_app/settings/preferences/")({
  component: Preferences,
});

function Preferences() {
  const fileRef = useRef<HTMLInputElement>(null);

  function exp() {
    const json = exportAllData();
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `hr-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  }

  function imp(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try { importAllData(String(r.result)); alert("تم استيراد البيانات بنجاح"); }
      catch { alert("فشل الاستيراد"); }
    };
    r.readAsText(f);
  }

  function reset() {
    if (confirm("سيتم حذف جميع البيانات. هل تريد المتابعة؟")) {
      clearAllData();
      window.location.reload();
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader icon={Settings} title="تفضيلات النظام" subtitle="إدارة بيانات النظام والنسخ الاحتياطية" iconBg="gradient-primary" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card icon={Download} title="تصدير البيانات" desc="احفظ جميع بيانات النظام في ملف JSON قابل للاستيراد لاحقاً">
          <Button onClick={exp} className="gradient-primary text-primary-foreground border-0 gap-2"><Download className="size-4" /> تصدير الآن</Button>
        </Card>
        <Card icon={Upload} title="استيراد البيانات" desc="استيراد نسخة احتياطية سابقة (سيتم استبدال البيانات الحالية)">
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={imp} />
          <Button onClick={() => fileRef.current?.click()} className="bg-info text-info-foreground gap-2"><Upload className="size-4" /> اختر ملف</Button>
        </Card>
        <Card icon={Database} title="معلومات التخزين" desc="جميع بياناتك مخزنة في متصفحك (localStorage). لا يتم إرسال أي شيء إلى الإنترنت.">
          <div className="text-xs text-success font-bold">✓ خصوصية تامة · بدون إنترنت</div>
        </Card>
        <Card icon={Trash2} title="إعادة تعيين النظام" desc="حذف جميع البيانات وإعادة تحميل البيانات التجريبية الأولية">
          <Button onClick={reset} variant="destructive" className="gap-2"><Trash2 className="size-4" /> حذف الكل</Button>
        </Card>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, desc, children }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6">
      <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
        <Icon className="size-6" />
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4 leading-relaxed">{desc}</p>
      {children}
    </div>
  );
}
