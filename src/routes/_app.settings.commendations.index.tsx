import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, BookOpen, Plus, Pencil, Trash2, Search } from "lucide-react";
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
import { useCommendationTypes } from "@/lib/data-init";
import type { CommendationType, CommendationLevel } from "@/lib/types";
import { uid } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const [types, setTypes] = useCommendationTypes();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<CommendationType | null>(null);
  const [delId, setDelId] = useState<string | null>(null);

  const filtered = types.filter((t) => !q || t.name.includes(q) || t.code.includes(q));

  function save(t: CommendationType) {
    setTypes((p) => edit ? p.map((x) => x.id === t.id ? t : x) : [...p, t]);
    toast.success(edit ? "تم تحديث كتاب الشكر" : "تمت إضافة كتاب الشكر");
    setOpen(false); setEdit(null);
  }
  function confirmDel() {
    if (!delId) return;
    setTypes((p) => p.filter((x) => x.id !== delId));
    toast.success("تم حذف كتاب الشكر");
    setDelId(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Award}
        title="كتب الشكر والتقدير"
        subtitle="إدارة أنواع كتب الشكر والتقدير وفق قانون انضباط موظفي الدولة رقم 14 لسنة 1991 - المادة 21"
        iconBg="gradient-amber"
        actions={<Button onClick={() => { setEdit(null); setOpen(true); }} className="gap-2 gradient-primary text-primary-foreground border-0"><Plus className="size-4" /> إضافة كتاب شكر</Button>}
      />

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

      <div className="rounded-2xl bg-card border border-border p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث..." className="pr-10 rounded-xl" />
        </div>
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
                <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-bold", levelMap[t.level].color)}>{levelMap[t.level].label}</span></td>
                <td className="px-4 py-3"><span className="font-bold text-amber arabic-num">{t.seniorityBonusMonths > 0 ? `+${t.seniorityBonusMonths} شهر` : "—"}</span></td>
                <td className="px-4 py-3"><span className="text-xs px-2.5 py-1 rounded-md bg-muted">{t.authority}</span></td>
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
              <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">لا توجد نتائج</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <CommendationDialog open={open} onOpenChange={setOpen} initial={edit} onSave={save} />

      <AlertDialog open={!!delId} onOpenChange={(v) => !v && setDelId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذا النوع من كتب الشكر؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
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

function CommendationDialog({ open, onOpenChange, initial, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; initial: CommendationType | null; onSave: (t: CommendationType) => void }) {
  const empty: CommendationType = { id: uid("ct_"), name: "", code: "", level: "department", seniorityBonusMonths: 0, authority: "", active: true };
  const [form, setForm] = useState<CommendationType>(initial || empty);

  useEffect(() => { setForm(initial || { ...empty, id: uid("ct_") }); /* eslint-disable-next-line */ }, [initial, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-2xl">
        <DialogHeader><DialogTitle>{initial ? "تعديل كتاب شكر" : "إضافة كتاب شكر"}</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, id: initial?.id || uid("ct_") }); }} className="space-y-3 py-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>الاسم</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label>الرمز</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>المستوى</Label>
              <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v as CommendationLevel })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(levelMap) as CommendationLevel[]).map((k) => (
                    <SelectItem key={k} value={k}>{levelMap[k].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label>القدم الممنوح (أشهر)</Label><Input type="number" min={0} value={form.seniorityBonusMonths} onChange={(e) => setForm({ ...form, seniorityBonusMonths: Number(e.target.value) })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>الجهة المانحة</Label><Input value={form.authority} onChange={(e) => setForm({ ...form, authority: e.target.value })} /></div>
            <div><Label>الحالة</Label>
              <Select value={String(form.active)} onValueChange={(v) => setForm({ ...form, active: v === "true" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="true">فعّال</SelectItem><SelectItem value="false">متوقف</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button type="submit" className="gradient-primary text-primary-foreground border-0">حفظ</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
