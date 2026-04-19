import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, Plus, Trash2, Pencil } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useJobTitles } from "@/lib/data-init";
import { uid } from "@/lib/storage";
import type { JobTitle } from "@/lib/types";

export const Route = createFileRoute("/_app/settings/job-titles/")({
  component: JobTitlesPage,
});

function JobTitlesPage() {
  const [titles, setTitles] = useJobTitles();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<JobTitle | null>(null);
  const [name, setName] = useState(""); const [code, setCode] = useState("");

  function openAdd() { setEdit(null); setName(""); setCode(""); setOpen(true); }
  function openEdit(t: JobTitle) { setEdit(t); setName(t.name); setCode(t.code); setOpen(true); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (edit) setTitles((p) => p.map((x) => x.id === edit.id ? { ...edit, name, code } : x));
    else setTitles((p) => [...p, { id: uid("j_"), name, code }]);
    setOpen(false);
  }
  function del(id: string) { if (confirm("حذف؟")) setTitles((p) => p.filter((x) => x.id !== id)); }

  return (
    <div className="space-y-6">
      <PageHeader icon={Briefcase} title="العناوين الوظيفية" subtitle="إدارة العناوين الوظيفية المعتمدة" iconBg="gradient-amber"
        actions={<Button onClick={openAdd} className="gap-2 gradient-primary text-primary-foreground border-0"><Plus className="size-4" /> إضافة عنوان</Button>} />

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr><th className="text-right px-4 py-3">#</th><th className="text-right px-4 py-3">العنوان</th><th className="text-right px-4 py-3">الرمز</th><th className="text-right px-4 py-3">الإجراءات</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {titles.map((t, i) => (
              <tr key={t.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 arabic-num text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3 font-semibold">{t.name}</td>
                <td className="px-4 py-3 text-amber font-mono font-bold">{t.code}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="size-8 text-amber" onClick={() => openEdit(t)}><Pencil className="size-4" /></Button>
                    <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => del(t.id)}><Trash2 className="size-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl"><DialogHeader><DialogTitle>{edit ? "تعديل" : "إضافة"} عنوان وظيفي</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3 py-3">
            <div><Label>الاسم</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><Label>الرمز</Label><Input value={code} onChange={(e) => setCode(e.target.value)} required /></div>
            <DialogFooter><Button type="submit" className="gradient-primary text-primary-foreground border-0">حفظ</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
