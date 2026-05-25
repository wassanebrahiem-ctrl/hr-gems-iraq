import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Users2, Plus, Search, Pencil, Trash2, Calendar, Crown, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCommittees, useEmployees, useDepartments } from "@/lib/data-init";
import { formatDateAR } from "@/lib/calc";
import { uid } from "@/lib/storage";
import type { Committee } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/committees/")({
  component: CommitteesPage,
});

function emptyCommittee(): Committee {
  return {
    id: "",
    name: "",
    number: "",
    date: new Date().toISOString().slice(0, 10),
    memberIds: [],
    chairId: undefined,
    purpose: "",
    active: true,
    endDate: "",
    createdAt: new Date().toISOString(),
  };
}

function CommitteesPage() {
  const [committees, setCommittees] = useCommittees();
  const [employees] = useEmployees();
  const [departments] = useDepartments();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Committee>(emptyCommittee());
  const [memberQ, setMemberQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim();
    const list = t
      ? committees.filter((c) => c.name.includes(t) || c.number.includes(t))
      : committees;
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [committees, q]);

  function openNew() {
    setDraft(emptyCommittee());
    setMemberQ("");
    setOpen(true);
  }
  function openEdit(c: Committee) {
    setDraft({ ...c });
    setMemberQ("");
    setOpen(true);
  }
  function save() {
    if (!draft.name.trim() || !draft.number.trim()) {
      toast.error("اسم اللجنة ورقم الأمر الإداري مطلوبان");
      return;
    }
    if (draft.memberIds.length === 0) {
      toast.error("أضف عضواً واحداً على الأقل");
      return;
    }
    if (draft.id) {
      setCommittees((prev) => prev.map((p) => (p.id === draft.id ? draft : p)));
      toast.success("تم تحديث اللجنة");
    } else {
      setCommittees((prev) => [{ ...draft, id: uid("cm") }, ...prev]);
      toast.success("تم إنشاء اللجنة");
    }
    setOpen(false);
  }
  function remove(id: string) {
    if (!confirm("حذف هذه اللجنة؟")) return;
    setCommittees((prev) => prev.filter((p) => p.id !== id));
  }
  function toggleMember(empId: string) {
    setDraft((d) => {
      const has = d.memberIds.includes(empId);
      const memberIds = has ? d.memberIds.filter((x) => x !== empId) : [...d.memberIds, empId];
      const chairId = has && d.chairId === empId ? undefined : d.chairId;
      return { ...d, memberIds, chairId };
    });
  }

  const memberResults = useMemo(() => {
    const t = memberQ.trim();
    const base = t
      ? employees.filter((e) => e.fullName.includes(t) || e.empNo.includes(t))
      : employees;
    return base.slice(0, 12);
  }, [memberQ, employees]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users2}
        title="اللجان"
        subtitle="إدارة اللجان والمكلفين بها"
        iconBg="gradient-primary"
        actions={
          <Button onClick={openNew} className="gap-2 gradient-primary text-primary-foreground border-0">
            <Plus className="size-4" /> إضافة لجنة
          </Button>
        }
      />

      <div className="rounded-2xl bg-card border border-border p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم اللجنة أو رقم الأمر الإداري..." className="pr-10 h-11 rounded-xl" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((c) => {
          const members = c.memberIds.map((id) => employees.find((e) => e.id === id)).filter(Boolean);
          const chair = c.chairId ? employees.find((e) => e.id === c.chairId) : null;
          return (
            <div key={c.id} className="rounded-2xl bg-card border border-border p-5 shadow-sm hover:shadow-md transition-smooth">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-base">{c.name}</h3>
                    <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-bold", c.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
                      {c.active ? "فعّالة" : "منتهية"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 arabic-num flex items-center gap-3 flex-wrap">
                    <span>رقم الأمر الإداري: <span className="font-bold text-foreground">{c.number}</span></span>
                    <span className="inline-flex items-center gap-1"><Calendar className="size-3" /> {formatDateAR(c.date)}</span>
                    {c.endDate && <span>الانتهاء: {formatDateAR(c.endDate)}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="size-8 text-amber" onClick={() => openEdit(c)}><Pencil className="size-4" /></Button>
                  <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => remove(c.id)}><Trash2 className="size-4" /></Button>
                </div>
              </div>
              {c.purpose && <p className="text-xs text-muted-foreground mb-3">{c.purpose}</p>}
              <div className="text-xs font-semibold text-muted-foreground mb-2">الأعضاء ({members.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {members.map((m) => {
                  if (!m) return null;
                  const isChair = chair?.id === m.id;
                  return (
                    <Link key={m.id} to="/employees/$id" params={{ id: m.id }} search={{ tab: undefined }}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-smooth",
                        isChair ? "bg-amber/15 text-amber hover:bg-amber/25" : "bg-muted hover:bg-muted/70"
                      )}>
                      {isChair && <Crown className="size-3" />}
                      {m.fullName}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="md:col-span-2 rounded-2xl bg-card border border-dashed border-border p-12 text-center text-muted-foreground">
            لا توجد لجان. ابدأ بإضافة لجنة جديدة.
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft.id ? "تعديل لجنة" : "إضافة لجنة جديدة"}</DialogTitle>
            <DialogDescription>أدخل بيانات اللجنة واختر الأعضاء</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>اسم اللجنة *</Label>
                <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="لجنة المشتريات..." />
              </div>
              <div>
                <Label>رقم اللجنة *</Label>
                <Input value={draft.number} onChange={(e) => setDraft({ ...draft, number: e.target.value })} placeholder="123/2026" />
              </div>
              <div>
                <Label>تاريخ التشكيل</Label>
                <Input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
              </div>
              <div>
                <Label>تاريخ الانتهاء (اختياري)</Label>
                <Input type="date" value={draft.endDate || ""} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label>الحالة</Label>
                <Select value={draft.active ? "active" : "ended"} onValueChange={(v) => setDraft({ ...draft, active: v === "active" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">فعّالة</SelectItem>
                    <SelectItem value="ended">منتهية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>الغرض / المهام</Label>
                <Textarea value={draft.purpose || ""} onChange={(e) => setDraft({ ...draft, purpose: e.target.value })} rows={2} />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <Label className="mb-2 block">الأعضاء ({draft.memberIds.length})</Label>
              {draft.memberIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {draft.memberIds.map((id) => {
                    const e = employees.find((x) => x.id === id);
                    if (!e) return null;
                    const isChair = draft.chairId === id;
                    return (
                      <span key={id} className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs", isChair ? "bg-amber/15 text-amber" : "bg-primary/10 text-primary")}>
                        {isChair && <Crown className="size-3" />}
                        {e.fullName}
                        <button type="button" onClick={() => setDraft({ ...draft, chairId: isChair ? undefined : id })} className="hover:underline text-[10px] mx-1">
                          {isChair ? "إلغاء الرئاسة" : "تعيين رئيس"}
                        </button>
                        <button type="button" onClick={() => toggleMember(id)} className="hover:text-destructive"><X className="size-3" /></button>
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input value={memberQ} onChange={(e) => setMemberQ(e.target.value)} placeholder="ابحث عن موظف لإضافته..." className="pr-10" />
              </div>
              <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-border divide-y divide-border">
                {memberResults.map((e) => {
                  const dept = departments.find((d) => d.id === e.departmentId);
                  const selected = draft.memberIds.includes(e.id);
                  return (
                    <button key={e.id} type="button" onClick={() => toggleMember(e.id)}
                      className={cn("w-full flex items-center gap-3 p-2.5 text-right transition-smooth", selected ? "bg-primary/10" : "hover:bg-muted/50")}>
                      <div className="size-8 rounded-lg bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center">{e.fullName.slice(0, 2)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{e.fullName}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{e.empNo} · {dept?.name}</div>
                      </div>
                      {selected && <span className="text-[11px] font-bold text-primary">مضاف</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button onClick={save} className="gradient-primary text-primary-foreground border-0">حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
