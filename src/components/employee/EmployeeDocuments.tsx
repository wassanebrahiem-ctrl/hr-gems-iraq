import { useMemo, useState } from "react";
import { Upload, FileText, Image as ImageIcon, FileArchive, Download, Trash2, Eye, Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useEmployeeDocuments } from "@/lib/data-init";
import { uid } from "@/lib/storage";
import { formatDateAR } from "@/lib/calc";
import type { DocumentCategory, EmployeeDocument } from "@/lib/types";
import { toast } from "sonner";

const CATEGORIES: { v: DocumentCategory; n: string; tone: string }[] = [
  { v: "id", n: "البطاقة الموحدة / الجنسية", tone: "bg-primary/10 text-primary" },
  { v: "civil", n: "الأحوال المدنية", tone: "bg-primary/10 text-primary" },
  { v: "residence", n: "بطاقة السكن", tone: "bg-info/10 text-info" },
  { v: "passport", n: "جواز السفر", tone: "bg-info/10 text-info" },
  { v: "education", n: "شهادات دراسية", tone: "bg-amber/15 text-amber" },
  { v: "appointment", n: "أمر المباشرة / التعيين", tone: "bg-success/10 text-success" },
  { v: "promotion", n: "أوامر الترقية", tone: "bg-success/10 text-success" },
  { v: "increment", n: "أوامر العلاوة", tone: "bg-success/10 text-success" },
  { v: "leave", n: "إجازات", tone: "bg-info/10 text-info" },
  { v: "penalty", n: "عقوبات", tone: "bg-destructive/10 text-destructive" },
  { v: "commendation", n: "كتب شكر", tone: "bg-amber/15 text-amber" },
  { v: "medical", n: "تقارير طبية", tone: "bg-destructive/10 text-destructive" },
  { v: "contract", n: "عقود", tone: "bg-primary/10 text-primary" },
  { v: "other", n: "أخرى", tone: "bg-muted text-muted-foreground" },
];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

function fileIcon(mime: string) {
  if (mime.startsWith("image/")) return ImageIcon;
  if (mime.includes("zip") || mime.includes("rar")) return FileArchive;
  return FileText;
}

export function EmployeeDocuments({ employeeId }: { employeeId: string }) {
  const [docs, setDocs] = useEmployeeDocuments();
  const [openAdd, setOpenAdd] = useState(false);
  const [preview, setPreview] = useState<EmployeeDocument | null>(null);
  const [filter, setFilter] = useState<DocumentCategory | "all">("all");
  const [q, setQ] = useState("");

  const empDocs = useMemo(
    () => docs.filter((d) => d.employeeId === employeeId),
    [docs, employeeId]
  );
  const filtered = useMemo(() => {
    return empDocs.filter((d) => {
      if (filter !== "all" && d.category !== filter) return false;
      if (q && !d.title.toLowerCase().includes(q.toLowerCase()) && !d.fileName.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [empDocs, filter, q]);

  const counts = useMemo(() => {
    const m = new Map<DocumentCategory, number>();
    empDocs.forEach((d) => m.set(d.category, (m.get(d.category) || 0) + 1));
    return m;
  }, [empDocs]);

  function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المستمسك؟")) return;
    setDocs((p) => p.filter((d) => d.id !== id));
    toast.success("تم حذف المستمسك");
  }

  function handleDownload(d: EmployeeDocument) {
    const a = document.createElement("a");
    a.href = d.dataUrl; a.download = d.fileName; a.click();
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث في المستمسكات..." className="pr-9" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <Select value={filter} onValueChange={(v) => setFilter(v as DocumentCategory | "all")}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل التصنيفات ({empDocs.length})</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.v} value={c.v}>{c.n} ({counts.get(c.v) || 0})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setOpenAdd(true)} className="gap-2 gradient-primary text-primary-foreground border-0">
          <Plus className="size-4" /> إرفاق مستمسك
        </Button>
      </div>

      {/* Category quick stats */}
      {empDocs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {CATEGORIES.filter(c => (counts.get(c.v) || 0) > 0).map((c) => (
            <button
              key={c.v}
              onClick={() => setFilter(filter === c.v ? "all" : c.v)}
              className={`text-right p-2.5 rounded-xl border transition-smooth ${filter === c.v ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}
            >
              <div className={`inline-flex size-7 rounded-lg items-center justify-center mb-1 ${c.tone}`}>
                <FileText className="size-3.5" />
              </div>
              <div className="text-[11px] text-muted-foreground line-clamp-1">{c.n}</div>
              <div className="text-sm font-bold arabic-num">{counts.get(c.v)}</div>
            </button>
          ))}
        </div>
      )}

      {/* Documents grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-muted/20">
          <Upload className="size-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-1">{empDocs.length === 0 ? "لا توجد مستمسكات مرفقة بعد" : "لا توجد نتائج مطابقة"}</p>
          {empDocs.length === 0 && (
            <Button onClick={() => setOpenAdd(true)} variant="outline" className="mt-3 gap-2"><Plus className="size-4" /> ابدأ بإرفاق مستمسك</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => {
            const cat = CATEGORIES.find((c) => c.v === d.category);
            const Icon = fileIcon(d.mimeType);
            const isImage = d.mimeType.startsWith("image/");
            return (
              <div key={d.id} className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-md transition-smooth group">
                <div className="aspect-video bg-muted/40 relative overflow-hidden">
                  {isImage ? (
                    <img src={d.dataUrl} alt={d.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="size-14 text-muted-foreground/40" />
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-full ${cat?.tone}`}>{cat?.n}</span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="font-bold text-sm line-clamp-1">{d.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{d.fileName}</div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground arabic-num">
                    <span>{formatBytes(d.size)}</span>
                    <span>·</span>
                    <span>{formatDateAR(d.createdAt.slice(0, 10))}</span>
                    {d.expiryDate && <><span>·</span><span className="text-amber">ينتهي {formatDateAR(d.expiryDate)}</span></>}
                  </div>
                  {d.notes && <p className="text-xs text-muted-foreground line-clamp-2 pt-1 border-t border-border">{d.notes}</p>}
                  <div className="flex gap-1.5 pt-1">
                    <Button size="sm" variant="outline" className="flex-1 gap-1 h-8" onClick={() => setPreview(d)}><Eye className="size-3.5" /> عرض</Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleDownload(d)}><Download className="size-3.5" /></Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(d.id)}><Trash2 className="size-3.5" /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddDocumentDialog open={openAdd} onOpenChange={setOpenAdd} employeeId={employeeId} onAdd={(d) => setDocs((p) => [d, ...p])} />
      <PreviewDialog doc={preview} onClose={() => setPreview(null)} onDownload={handleDownload} />
    </div>
  );
}

function AddDocumentDialog({ open, onOpenChange, employeeId, onAdd }: { open: boolean; onOpenChange: (v: boolean) => void; employeeId: string; onAdd: (d: EmployeeDocument) => void }) {
  const [category, setCategory] = useState<DocumentCategory>("id");
  const [title, setTitle] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState("");

  function reset() { setCategory("id"); setTitle(""); setIssueDate(""); setExpiryDate(""); setNotes(""); setFile(null); setDataUrl(""); }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > MAX_SIZE) { toast.error("الحد الأقصى 5 ميغابايت"); return; }
    const r = new FileReader();
    r.onload = () => { setDataUrl(r.result as string); setFile(f); if (!title) setTitle(f.name.replace(/\.[^.]+$/, "")); };
    r.readAsDataURL(f);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !dataUrl) { toast.error("يرجى اختيار ملف"); return; }
    onAdd({
      id: uid("doc_"), employeeId, category, title: title || file.name,
      fileName: file.name, mimeType: file.type || "application/octet-stream",
      size: file.size, dataUrl,
      issueDate: issueDate || undefined, expiryDate: expiryDate || undefined,
      notes: notes || undefined, createdAt: new Date().toISOString(),
    });
    toast.success("تم إرفاق المستمسك");
    reset(); onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent dir="rtl" className="max-w-lg">
        <DialogHeader><DialogTitle>إرفاق مستمسك جديد</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4 py-2">
          <div>
            <Label className="mb-1.5 block">التصنيف</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as DocumentCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.v} value={c.v}>{c.n}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block">عنوان المستمسك</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: شهادة البكالوريوس" required />
          </div>
          <div>
            <Label className="mb-1.5 block">الملف <span className="text-xs text-muted-foreground">(صورة أو PDF — حتى 5MB)</span></Label>
            <Input type="file" accept="image/*,application/pdf" onChange={handleFile} required />
            {file && <p className="text-xs text-muted-foreground mt-1.5 arabic-num">{file.name} · {formatBytes(file.size)}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="mb-1.5 block">تاريخ الإصدار</Label><Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} /></div>
            <div><Label className="mb-1.5 block">تاريخ الانتهاء</Label><Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} /></div>
          </div>
          <div>
            <Label className="mb-1.5 block">ملاحظات</Label>
            <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground border-0 gap-2"><Upload className="size-4" /> رفع وحفظ</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PreviewDialog({ doc, onClose, onDownload }: { doc: EmployeeDocument | null; onClose: () => void; onDownload: (d: EmployeeDocument) => void }) {
  if (!doc) return null;
  const isImage = doc.mimeType.startsWith("image/");
  const isPdf = doc.mimeType === "application/pdf";
  return (
    <Dialog open={!!doc} onOpenChange={(v) => !v && onClose()}>
      <DialogContent dir="rtl" className="max-w-4xl">
        <DialogHeader><DialogTitle>{doc.title}</DialogTitle></DialogHeader>
        <div className="bg-muted/30 rounded-xl overflow-hidden" style={{ minHeight: 400 }}>
          {isImage && <img src={doc.dataUrl} alt={doc.title} className="w-full h-auto max-h-[70vh] object-contain mx-auto" />}
          {isPdf && <iframe src={doc.dataUrl} title={doc.title} className="w-full" style={{ height: "70vh" }} />}
          {!isImage && !isPdf && (
            <div className="flex flex-col items-center justify-center py-20">
              <FileText className="size-16 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground mb-3">لا يمكن معاينة هذا النوع من الملفات</p>
              <Button onClick={() => onDownload(doc)} className="gap-2"><Download className="size-4" /> تنزيل الملف</Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>إغلاق</Button>
          <Button onClick={() => onDownload(doc)} className="gap-2 gradient-primary text-primary-foreground border-0"><Download className="size-4" /> تنزيل</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
