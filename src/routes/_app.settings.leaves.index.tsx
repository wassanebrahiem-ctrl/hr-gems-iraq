import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Plus, Trash2, Pencil, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLeaveTypes } from "@/lib/data-init";
import type { LeaveType, LeaveCategory } from "@/lib/types";
import { uid } from "@/lib/storage";

export const Route = createFileRoute("/_app/settings/leaves/")({
  component: LeavesSettings,
});

const categories: { v: LeaveCategory; label: string; color: string }[] = [
  { v: "regular", label: "اعتيادية", color: "bg-info text-info-foreground" },
  { v: "sick", label: "مرضية", color: "bg-destructive text-destructive-foreground" },
  { v: "maternity", label: "أمومة", color: "bg-pink-500 text-white" },
  { v: "paternity", label: "أبوة", color: "bg-blue-500 text-white" },
  { v: "marriage", label: "زواج", color: "bg-rose-500 text-white" },
  { v: "bereavement", label: "وفاة", color: "bg-slate-700 text-white" },
  { v: "hajj", label: "حج", color: "bg-amber text-amber-foreground" },
  { v: "study", label: "دراسية", color: "bg-purple-500 text-white" },
  { v: "unpaid", label: "بدون راتب", color: "bg-zinc-700 text-white" },
];

function LeavesSettings() {
  const [types, setTypes] = useLeaveTypes();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<LeaveType | null>(null);

  const filtered = types.filter((t) => !q || t.name.includes(q) || t.code.includes(q));

  function save(t: LeaveType) {
    setTypes((p) => edit ? p.map((x) => x.id === t.id ? t : x) : [...p, t]);
    setOpen(false); setEdit(null);
  }
  function del(id: string) { if (confirm("حذف هذا النوع؟")) setTypes((p) => p.filter((x) => x.id !== id)); }

  return (
    <div className="space-y-6">
      <PageHeader icon={CalendarDays} title="قائمة أنواع الإجازات" subtitle="مرجعية: قانون الخدمة المدنية 24/1960 وقانون العمل 37/2015" iconBg="gradient-amber"
        actions={<Button onClick={() => { setEdit(null); setOpen(true); }} className="gap-2 gradient-primary text-primary-foreground border-0"><Plus className="size-4" /> إضافة نوع</Button>} />

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
              <th className="text-right px-4 py-3 font-semibold">نوع الإجازة</th>
              <th className="text-right px-4 py-3 font-semibold">التصنيف</th>
              <th className="text-right px-4 py-3 font-semibold">المدة (أيام/سنة)</th>
              <th className="text-right px-4 py-3 font-semibold">نوع الراتب</th>
              <th className="text-right px-4 py-3 font-semibold">الحالة</th>
              <th className="text-right px-4 py-3 font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((t, i) => {
              const cat = categories.find((c) => c.v === t.category)!;
              return (
                <tr key={t.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 arabic-num text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold">{t.name}</div>
                    <div className="text-xs text-muted-foreground arabic-num">{t.code} · {t.legalRef}</div>
                  </td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${cat.color}`}>{cat.label}</span></td>
                  <td className="px-4 py-3"><span className="font-bold arabic-num">{t.daysPerYear}</span> <span className="text-xs text-muted-foreground">يوم/سنة</span></td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${t.paid ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>{t.paid ? "براتب كامل" : "بدون راتب"}</span></td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${t.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{t.active ? "فعّال" : "متوقف"}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="size-8 text-amber" onClick={() => { setEdit(t); setOpen(true); }}><Pencil className="size-4" /></Button>
                      <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => del(t.id)}><Trash2 className="size-4" /></Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <LeaveDialog open={open} onOpenChange={setOpen} initial={edit} onSave={save} />
    </div>
  );
}

function LeaveDialog({ open, onOpenChange, initial, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; initial: LeaveType | null; onSave: (t: LeaveType) => void }) {
  const [form, setForm] = useState<LeaveType>(initial || { id: uid("lt_"), name: "", code: "", category: "regular", daysPerYear: 30, paid: true, active: true, legalRef: "" });
  // reset on open
  useState(() => { if (initial) setForm(initial); });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl"><DialogHeader><DialogTitle>{initial ? "تعديل نوع إجازة" : "إضافة نوع إجازة"}</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, id: initial?.id || uid("lt_") }); }} className="space-y-3 py-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>الاسم</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label>الرمز</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></div>
          </div>
          <div><Label>التصنيف</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as LeaveCategory })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c.v} value={c.v}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>أيام/سنة</Label><Input type="number" value={form.daysPerYear} onChange={(e) => setForm({ ...form, daysPerYear: Number(e.target.value) })} /></div>
            <div><Label>نوع الراتب</Label>
              <Select value={String(form.paid)} onValueChange={(v) => setForm({ ...form, paid: v === "true" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="true">براتب كامل</SelectItem><SelectItem value="false">بدون راتب</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>المرجع القانوني</Label><Input value={form.legalRef} onChange={(e) => setForm({ ...form, legalRef: e.target.value })} /></div>
          <DialogFooter><Button type="submit" className="gradient-primary text-primary-foreground border-0">حفظ</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
