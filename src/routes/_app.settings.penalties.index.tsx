import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck, ShieldAlert, ShieldX, Plus, Pencil, Trash2, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePenaltyTypes } from "@/lib/data-init";
import type { PenaltyType, PenaltySeverity } from "@/lib/types";
import { uid } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const [types, setTypes] = usePenaltyTypes();
  const [filter, setFilter] = useState<"all" | PenaltySeverity>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<PenaltyType | null>(null);
  const [delId, setDelId] = useState<string | null>(null);

  const counts = {
    all: types.length,
    light: types.filter((t) => t.severity === "light").length,
    medium: types.filter((t) => t.severity === "medium").length,
    severe: types.filter((t) => t.severity === "severe").length,
    extreme: types.filter((t) => t.severity === "extreme").length,
  };

  const filtered = types
    .filter((t) => filter === "all" || t.severity === filter)
    .filter((t) => !q || t.name.includes(q) || t.code.includes(q));

  function save(t: PenaltyType) {
    setTypes((p) => edit ? p.map((x) => x.id === t.id ? t : x) : [...p, t]);
    toast.success(edit ? "تم تحديث العقوبة" : "تمت إضافة العقوبة");
    setOpen(false); setEdit(null);
  }
  function confirmDel() {
    if (!delId) return;
    setTypes((p) => p.filter((x) => x.id !== delId));
    toast.success("تم حذف العقوبة");
    setDelId(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={AlertTriangle}
        title="قائمة أنواع العقوبات"
        subtitle="وفق قانون انضباط موظفي الدولة رقم 14 لسنة 1991"
        iconBg="bg-destructive"
        actions={<Button onClick={() => { setEdit(null); setOpen(true); }} className="gap-2 gradient-primary text-primary-foreground border-0"><Plus className="size-4" /> إضافة عقوبة</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={AlertTriangle} label="إجمالي أنواع العقوبات" value={counts.all} tone="destructive" />
        <StatCard icon={ShieldAlert} label="عقوبات خفيفة/متوسطة" value={counts.light + counts.medium} tone="warning" />
        <StatCard icon={ShieldX} label="عقوبات شديدة/قصوى" value={counts.severe + counts.extreme} tone="destructive" />
        <StatCard icon={ShieldCheck} label="عقوبات فعّالة" value={types.filter((t) => t.active).length} tone="success" />
      </div>

      <div className="rounded-2xl bg-card border border-border p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث..." className="pr-10 rounded-xl" />
        </div>
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
              <th className="text-right px-4 py-3 font-semibold">الإجراءات</th>
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
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="size-8 text-amber" onClick={() => { setEdit(t); setOpen(true); }}><Pencil className="size-4" /></Button>
                    <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => setDelId(t.id)}><Trash2 className="size-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-10 text-muted-foreground">لا توجد نتائج</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <PenaltyDialog open={open} onOpenChange={setOpen} initial={edit} onSave={save} />

      <AlertDialog open={!!delId} onOpenChange={(v) => !v && setDelId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذا النوع من العقوبات؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PenaltyDialog({ open, onOpenChange, initial, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; initial: PenaltyType | null; onSave: (t: PenaltyType) => void }) {
  const empty: PenaltyType = { id: uid("pt_"), name: "", code: "", severity: "light", promotionDelayMonths: 0, authority: "", active: true, legalRef: "" };
  const [form, setForm] = useState<PenaltyType>(initial || empty);

  useEffect(() => { setForm(initial || { ...empty, id: uid("pt_") }); /* eslint-disable-next-line */ }, [initial, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-2xl">
        <DialogHeader><DialogTitle>{initial ? "تعديل عقوبة" : "إضافة عقوبة"}</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, id: initial?.id || uid("pt_") }); }} className="space-y-3 py-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>الاسم</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label>الرمز</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>الشدة</Label>
              <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v as PenaltySeverity })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(severityMap) as PenaltySeverity[]).map((k) => (
                    <SelectItem key={k} value={k}>{severityMap[k].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label>تأخير الترقية (أشهر)</Label><Input type="number" min={0} value={form.promotionDelayMonths} onChange={(e) => setForm({ ...form, promotionDelayMonths: Number(e.target.value) })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>الجهة المختصة</Label><Input value={form.authority} onChange={(e) => setForm({ ...form, authority: e.target.value })} /></div>
            <div><Label>الحالة</Label>
              <Select value={String(form.active)} onValueChange={(v) => setForm({ ...form, active: v === "true" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="true">فعّال</SelectItem><SelectItem value="false">متوقف</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>المرجع القانوني</Label><Input value={form.legalRef} onChange={(e) => setForm({ ...form, legalRef: e.target.value })} placeholder="مثال: م.8/قانون 14 لسنة 1991" /></div>
          <DialogFooter><Button type="submit" className="gradient-primary text-primary-foreground border-0">حفظ</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
