import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Crown, Plus, Trash2, Pencil, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { usePositions, useEmployees } from "@/lib/data-init";
import { uid } from "@/lib/storage";
import { POSITION_LEVEL_LABELS, type Position, type PositionLevel } from "@/lib/types";

export const Route = createFileRoute("/_app/settings/positions/")({
  component: PositionsPage,
});

const LEVELS: PositionLevel[] = ["general_manager", "department", "division", "unit", "other"];

const LEVEL_TONE: Record<PositionLevel, string> = {
  general_manager: "bg-primary/15 text-primary",
  department: "bg-info/15 text-info",
  division: "bg-amber/15 text-amber",
  unit: "bg-success/15 text-success",
  other: "bg-muted text-muted-foreground",
};

function PositionsPage() {
  const [positions, setPositions] = usePositions();
  const [employees] = useEmployees();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Position | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [level, setLevel] = useState<PositionLevel>("department");
  const [notes, setNotes] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return positions;
    return positions.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        POSITION_LEVEL_LABELS[p.level].toLowerCase().includes(q)
    );
  }, [positions, query]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<PositionLevel, Position[]>>(
      (acc, p) => {
        (acc[p.level] ||= []).push(p);
        return acc;
      },
      {} as Record<PositionLevel, Position[]>
    );
  }, [filtered]);

  function openAdd() {
    setEdit(null); setName(""); setCode(""); setLevel("department"); setNotes(""); setOpen(true);
  }
  function openEdit(p: Position) {
    setEdit(p); setName(p.name); setCode(p.code); setLevel(p.level); setNotes(p.notes || ""); setOpen(true);
  }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (edit) {
      setPositions((prev) => prev.map((x) => x.id === edit.id ? { ...edit, name, code, level, notes } : x));
    } else {
      setPositions((prev) => [...prev, { id: uid("p_"), name, code, level, notes }]);
    }
    setOpen(false);
  }
  function del(id: string, posName: string) {
    const inUse = employees.filter((e) => e.position === posName).length;
    const msg = inUse > 0
      ? `هذا المنصب مرتبط بـ ${inUse} موظف. هل تريد حذفه فعلاً؟`
      : "حذف هذا المنصب الإداري؟";
    if (confirm(msg)) setPositions((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Crown}
        title="المناصب الإدارية"
        subtitle={`${positions.length} منصب إداري - منفصلة عن العنوان الوظيفي`}
        iconBg="gradient-primary"
        actions={
          <Button onClick={openAdd} className="gap-2 gradient-primary text-primary-foreground border-0">
            <Plus className="size-4" /> إضافة منصب
          </Button>
        }
      />

      <div className="rounded-2xl bg-info/5 border border-info/20 p-4 text-sm leading-relaxed">
        <div className="font-bold text-info mb-1">ما الفرق بين العنوان الوظيفي والمنصب الإداري؟</div>
        <ul className="list-disc pr-5 space-y-0.5 text-muted-foreground">
          <li><strong className="text-foreground">العنوان الوظيفي:</strong> صفة الموظف ودرجته (مهندس، محاسب، قانوني، مدقق...).</li>
          <li><strong className="text-foreground">المنصب الإداري:</strong> الموقع القيادي الذي يشغله (مدير قسم، مسؤول شعبة...). قد يكون فارغاً.</li>
        </ul>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث بالاسم، الرمز، أو المستوى..."
          className="pr-10"
        />
      </div>

      <div className="space-y-4">
        {LEVELS.filter((l) => grouped[l]?.length).map((l) => (
          <div key={l} className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${LEVEL_TONE[l]}`}>
                  {POSITION_LEVEL_LABELS[l]}
                </span>
              </div>
              <span className="text-xs text-muted-foreground arabic-num">{grouped[l].length}</span>
            </div>
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="text-right px-4 py-2 w-12">#</th>
                  <th className="text-right px-4 py-2">المنصب</th>
                  <th className="text-right px-4 py-2 w-32">الرمز</th>
                  <th className="text-right px-4 py-2 w-24">المعينون</th>
                  <th className="text-right px-4 py-2 w-28">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {grouped[l].map((p, i) => {
                  const count = employees.filter((e) => e.position === p.name).length;
                  return (
                    <tr key={p.id} className="hover:bg-muted/20">
                      <td className="px-4 py-2.5 arabic-num text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-2.5 font-medium">{p.name}</td>
                      <td className="px-4 py-2.5 text-amber font-mono text-xs font-bold">{p.code}</td>
                      <td className="px-4 py-2.5 arabic-num">
                        <span className="inline-flex items-center justify-center min-w-8 h-7 px-2 rounded-full bg-primary/10 text-primary font-bold text-xs">
                          {count}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="size-8 text-amber" onClick={() => openEdit(p)}><Pencil className="size-4" /></Button>
                          <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => del(p.id, p.name)}><Trash2 className="size-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl">
            لا توجد نتائج مطابقة
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{edit ? "تعديل" : "إضافة"} منصب إداري</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3 py-3">
            <div><Label>الاسم</Label><Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="مثال: مدير قسم" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>الرمز</Label><Input value={code} onChange={(e) => setCode(e.target.value)} required /></div>
              <div>
                <Label>المستوى</Label>
                <Select value={level} onValueChange={(v) => setLevel(v as PositionLevel)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((l) => <SelectItem key={l} value={l}>{POSITION_LEVEL_LABELS[l]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>ملاحظات</Label><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
            <DialogFooter><Button type="submit" className="gradient-primary text-primary-foreground border-0">حفظ</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
