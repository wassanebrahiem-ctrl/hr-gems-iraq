import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Briefcase, Plus, Trash2, Pencil, Search } from "lucide-react";
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
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [grade, setGrade] = useState<number>(7);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [filterCat, setFilterCat] = useState<string>("");

  const categories = useMemo(
    () => Array.from(new Set(titles.map((t) => t.category).filter(Boolean))) as string[],
    [titles]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return titles.filter((t) => {
      if (filterCat && t.category !== filterCat) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        (t.category ?? "").toLowerCase().includes(q)
      );
    });
  }, [titles, query, filterCat]);

  // Group by category
  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, JobTitle[]>>((acc, t) => {
      const k = t.category || "أخرى";
      (acc[k] ||= []).push(t);
      return acc;
    }, {});
  }, [filtered]);

  function openAdd() {
    setEdit(null); setName(""); setCode(""); setGrade(7); setCategory(""); setOpen(true);
  }
  function openEdit(t: JobTitle) {
    setEdit(t); setName(t.name); setCode(t.code);
    setGrade(t.defaultGrade ?? 7); setCategory(t.category ?? ""); setOpen(true);
  }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (edit) {
      setTitles((p) => p.map((x) => x.id === edit.id ? { ...edit, name, code, defaultGrade: grade, category } : x));
    } else {
      setTitles((p) => [...p, { id: uid("j_"), name, code, defaultGrade: grade, category }]);
    }
    setOpen(false);
  }
  function del(id: string) {
    if (confirm("حذف هذا العنوان الوظيفي؟")) setTitles((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Briefcase}
        title="العناوين الوظيفية"
        subtitle={`${titles.length} عنوان وظيفي وفق السلم الوظيفي العراقي`}
        iconBg="gradient-amber"
        actions={<Button onClick={openAdd} className="gap-2 gradient-primary text-primary-foreground border-0"><Plus className="size-4" /> إضافة عنوان</Button>}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالاسم أو الرمز أو التصنيف..."
            className="pr-10"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-3 py-2 rounded-md border border-border bg-background text-sm min-w-[200px]"
        >
          <option value="">كل التصنيفات</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Grouped list */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-sm">{cat}</h3>
              <span className="text-xs text-muted-foreground arabic-num">{items.length}</span>
            </div>
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="text-right px-4 py-2 w-12">#</th>
                  <th className="text-right px-4 py-2">العنوان</th>
                  <th className="text-right px-4 py-2 w-32">الرمز</th>
                  <th className="text-right px-4 py-2 w-24">الدرجة</th>
                  <th className="text-right px-4 py-2 w-28">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items
                  .slice()
                  .sort((a, b) => (a.defaultGrade ?? 99) - (b.defaultGrade ?? 99))
                  .map((t, i) => (
                    <tr key={t.id} className="hover:bg-muted/20">
                      <td className="px-4 py-2.5 arabic-num text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-2.5 font-medium">{t.name}</td>
                      <td className="px-4 py-2.5 text-amber font-mono text-xs font-bold">{t.code}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold arabic-num text-sm">
                          {t.defaultGrade ?? "-"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
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
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl">
            لا توجد نتائج مطابقة
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{edit ? "تعديل" : "إضافة"} عنوان وظيفي</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3 py-3">
            <div><Label>الاسم</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>الرمز</Label><Input value={code} onChange={(e) => setCode(e.target.value)} required /></div>
              <div><Label>الدرجة (1-11)</Label><Input type="number" min={1} max={11} value={grade} onChange={(e) => setGrade(Number(e.target.value))} required /></div>
            </div>
            <div>
              <Label>التصنيف</Label>
              <Input
                list="job-categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="مثال: الوظائف الهندسية"
              />
              <datalist id="job-categories">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <DialogFooter><Button type="submit" className="gradient-primary text-primary-foreground border-0">حفظ</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
