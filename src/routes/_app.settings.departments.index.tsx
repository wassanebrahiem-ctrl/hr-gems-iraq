import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Plus, Trash2, Pencil } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useDepartments, useEmployees } from "@/lib/data-init";
import { uid } from "@/lib/storage";
import type { Department } from "@/lib/types";

export const Route = createFileRoute("/_app/settings/departments/")({
  component: DeptsPage,
});

function DeptsPage() {
  const [depts, setDepts] = useDepartments();
  const [employees] = useEmployees();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Department | null>(null);
  const [name, setName] = useState(""); const [code, setCode] = useState("");

  function openAdd() { setEdit(null); setName(""); setCode(""); setOpen(true); }
  function openEdit(d: Department) { setEdit(d); setName(d.name); setCode(d.code); setOpen(true); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (edit) setDepts((p) => p.map((x) => x.id === edit.id ? { ...edit, name, code } : x));
    else setDepts((p) => [...p, { id: uid("d_"), name, code }]);
    setOpen(false);
  }
  function del(id: string) { if (confirm("حذف القسم؟")) setDepts((p) => p.filter((x) => x.id !== id)); }

  return (
    <div className="space-y-6">
      <PageHeader icon={Building2} title="الأقسام" subtitle="إدارة الأقسام والشُعب الإدارية" iconBg="gradient-primary"
        actions={<Button onClick={openAdd} className="gap-2 gradient-primary text-primary-foreground border-0"><Plus className="size-4" /> إضافة قسم</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {depts.map((d) => {
          const count = employees.filter((e) => e.departmentId === d.id).length;
          return (
            <div key={d.id} className="rounded-2xl bg-card border border-border p-5 hover:shadow-elegant transition-smooth">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono text-amber font-bold">{d.code}</div>
                  <div className="font-bold text-lg mt-1">{d.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 arabic-num">{count} موظف</div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="size-8 text-amber" onClick={() => openEdit(d)}><Pencil className="size-4" /></Button>
                  <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => del(d.id)}><Trash2 className="size-4" /></Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl"><DialogHeader><DialogTitle>{edit ? "تعديل قسم" : "إضافة قسم"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3 py-3">
            <div><Label>اسم القسم</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><Label>الرمز</Label><Input value={code} onChange={(e) => setCode(e.target.value)} required /></div>
            <DialogFooter><Button type="submit" className="gradient-primary text-primary-foreground border-0">حفظ</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
