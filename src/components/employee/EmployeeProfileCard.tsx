import { useState } from "react";
import { Pencil, Save, X, User, Heart, GraduationCap, Landmark, MapPin, Phone, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployeeProfiles } from "@/lib/data-init";
import type { EmployeeProfile, MaritalStatus, BloodType, EducationLevel } from "@/lib/types";

const MARITAL: { v: MaritalStatus; n: string }[] = [
  { v: "single", n: "أعزب" }, { v: "married", n: "متزوج" },
  { v: "divorced", n: "مطلق" }, { v: "widowed", n: "أرمل" },
];
const BLOOD: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const EDU: { v: EducationLevel; n: string }[] = [
  { v: "primary", n: "ابتدائية" }, { v: "intermediate", n: "متوسطة" },
  { v: "preparatory", n: "إعدادية" }, { v: "diploma", n: "دبلوم" },
  { v: "bachelor", n: "بكالوريوس" }, { v: "higher_diploma", n: "دبلوم عالي" },
  { v: "master", n: "ماجستير" }, { v: "phd", n: "دكتوراه" },
];

export function EmployeeProfileCard({ employeeId }: { employeeId: string }) {
  const [profiles, setProfiles] = useEmployeeProfiles();
  const existing = profiles.find((p) => p.employeeId === employeeId);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EmployeeProfile>(
    existing || { employeeId, updatedAt: new Date().toISOString() }
  );

  function save() {
    const next: EmployeeProfile = { ...draft, employeeId, updatedAt: new Date().toISOString() };
    setProfiles((p) => {
      const idx = p.findIndex((x) => x.employeeId === employeeId);
      if (idx >= 0) { const c = [...p]; c[idx] = next; return c; }
      return [next, ...p];
    });
    setEditing(false);
  }
  function cancel() {
    setDraft(existing || { employeeId, updatedAt: new Date().toISOString() });
    setEditing(false);
  }

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => setDraft((d) => ({ ...d, avatarDataUrl: r.result as string }));
    r.readAsDataURL(f);
  }

  const p = existing;

  if (!editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">المعلومات الشخصية والتفصيلية</h3>
          <Button onClick={() => setEditing(true)} variant="outline" className="gap-2">
            <Pencil className="size-4" /> تعديل الملف
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Section icon={User} title="معلومات شخصية" tone="primary">
            <Row label="اسم الأم" value={p?.motherName} />
            <Row label="الحالة الاجتماعية" value={MARITAL.find(m => m.v === p?.maritalStatus)?.n} />
            <Row label="عدد الأولاد" value={p?.childrenCount?.toString()} arabic />
            <Row label="فصيلة الدم" value={p?.bloodType} arabic />
            <Row label="الديانة" value={p?.religion} />
            <Row label="الجنسية" value={p?.nationality || "عراقية"} />
          </Section>

          <Section icon={Heart} title="مستمسكات وهويات" tone="info">
            <Row label="رقم البطاقة المدنية" value={p?.civilStatusId} arabic />
            <Row label="رقم جواز السفر" value={p?.passportNo} arabic />
            <Row label="بطاقة السكن" value={p?.residenceCardNo} arabic />
          </Section>

          <Section icon={MapPin} title="العنوان" tone="amber">
            <Row label="المحافظة" value={p?.governorate} />
            <Row label="القضاء/المنطقة" value={p?.district} />
            <Row label="العنوان التفصيلي" value={p?.address} full />
          </Section>

          <Section icon={Phone} title="الاتصال والطوارئ" tone="success">
            <Row label="هاتف بديل" value={p?.altPhone} arabic />
            <Row label="البريد الإلكتروني" value={p?.email} />
            <Row label="جهة الاتصال للطوارئ" value={p?.emergencyContactName} />
            <Row label="هاتف الطوارئ" value={p?.emergencyContactPhone} arabic />
            <Row label="صلة القرابة" value={p?.emergencyContactRelation} />
          </Section>

          <Section icon={GraduationCap} title="التحصيل الدراسي" tone="primary">
            <Row label="المستوى" value={EDU.find(e => e.v === p?.educationLevel)?.n} />
            <Row label="الاختصاص" value={p?.specialization} />
            <Row label="سنة التخرج" value={p?.graduationYear?.toString()} arabic />
            <Row label="الجامعة/المعهد" value={p?.university} />
          </Section>

          <Section icon={Landmark} title="المعلومات المصرفية" tone="info">
            <Row label="المصرف" value={p?.bankName} />
            <Row label="رقم الحساب" value={p?.bankAccount} arabic />
            <Row label="IBAN" value={p?.iban} arabic />
          </Section>
        </div>

        {p?.bio && (
          <div className="rounded-2xl bg-card border border-border p-5">
            <div className="font-bold text-sm text-muted-foreground mb-2">نبذة</div>
            <p className="text-sm leading-relaxed">{p.bio}</p>
          </div>
        )}

        {!p && (
          <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-muted/30">
            <p className="text-sm text-muted-foreground mb-3">لا توجد معلومات تفصيلية بعد</p>
            <Button onClick={() => setEditing(true)} className="gradient-primary text-primary-foreground border-0">ابدأ بإضافة المعلومات</Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-bold text-lg">تعديل الملف الشخصي</h3>
        <div className="flex gap-2">
          <Button onClick={cancel} variant="outline" className="gap-2"><X className="size-4" /> إلغاء</Button>
          <Button onClick={save} className="gradient-primary text-primary-foreground border-0 gap-2"><Save className="size-4" /> حفظ</Button>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-5">
        <Label className="mb-2 block">الصورة الشخصية</Label>
        <div className="flex items-center gap-4">
          <div className="size-20 rounded-2xl bg-muted overflow-hidden flex items-center justify-center border border-border">
            {draft.avatarDataUrl ? <img src={draft.avatarDataUrl} alt="" className="w-full h-full object-cover" /> : <Camera className="size-7 text-muted-foreground" />}
          </div>
          <Input type="file" accept="image/*" onChange={handleAvatar} className="max-w-xs" />
        </div>
      </div>

      <FormSection title="معلومات شخصية">
        <Field label="اسم الأم"><Input value={draft.motherName || ""} onChange={(e) => setDraft({ ...draft, motherName: e.target.value })} /></Field>
        <Field label="الحالة الاجتماعية">
          <Select value={draft.maritalStatus || ""} onValueChange={(v) => setDraft({ ...draft, maritalStatus: v as MaritalStatus })}>
            <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
            <SelectContent>{MARITAL.map(m => <SelectItem key={m.v} value={m.v}>{m.n}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="عدد الأولاد"><Input type="number" min={0} value={draft.childrenCount ?? ""} onChange={(e) => setDraft({ ...draft, childrenCount: e.target.value ? Number(e.target.value) : undefined })} /></Field>
        <Field label="فصيلة الدم">
          <Select value={draft.bloodType || ""} onValueChange={(v) => setDraft({ ...draft, bloodType: v as BloodType })}>
            <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
            <SelectContent>{BLOOD.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="الديانة"><Input value={draft.religion || ""} onChange={(e) => setDraft({ ...draft, religion: e.target.value })} /></Field>
        <Field label="الجنسية"><Input value={draft.nationality || ""} onChange={(e) => setDraft({ ...draft, nationality: e.target.value })} placeholder="عراقية" /></Field>
      </FormSection>

      <FormSection title="مستمسكات وهويات">
        <Field label="رقم البطاقة المدنية"><Input value={draft.civilStatusId || ""} onChange={(e) => setDraft({ ...draft, civilStatusId: e.target.value })} /></Field>
        <Field label="رقم جواز السفر"><Input value={draft.passportNo || ""} onChange={(e) => setDraft({ ...draft, passportNo: e.target.value })} /></Field>
        <Field label="بطاقة السكن"><Input value={draft.residenceCardNo || ""} onChange={(e) => setDraft({ ...draft, residenceCardNo: e.target.value })} /></Field>
      </FormSection>

      <FormSection title="العنوان">
        <Field label="المحافظة"><Input value={draft.governorate || ""} onChange={(e) => setDraft({ ...draft, governorate: e.target.value })} /></Field>
        <Field label="القضاء/المنطقة"><Input value={draft.district || ""} onChange={(e) => setDraft({ ...draft, district: e.target.value })} /></Field>
        <Field label="العنوان التفصيلي" full><Input value={draft.address || ""} onChange={(e) => setDraft({ ...draft, address: e.target.value })} /></Field>
      </FormSection>

      <FormSection title="الاتصال والطوارئ">
        <Field label="هاتف بديل"><Input value={draft.altPhone || ""} onChange={(e) => setDraft({ ...draft, altPhone: e.target.value })} /></Field>
        <Field label="البريد الإلكتروني"><Input type="email" value={draft.email || ""} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
        <Field label="جهة الاتصال للطوارئ"><Input value={draft.emergencyContactName || ""} onChange={(e) => setDraft({ ...draft, emergencyContactName: e.target.value })} /></Field>
        <Field label="هاتف الطوارئ"><Input value={draft.emergencyContactPhone || ""} onChange={(e) => setDraft({ ...draft, emergencyContactPhone: e.target.value })} /></Field>
        <Field label="صلة القرابة"><Input value={draft.emergencyContactRelation || ""} onChange={(e) => setDraft({ ...draft, emergencyContactRelation: e.target.value })} /></Field>
      </FormSection>

      <FormSection title="التحصيل الدراسي">
        <Field label="المستوى">
          <Select value={draft.educationLevel || ""} onValueChange={(v) => setDraft({ ...draft, educationLevel: v as EducationLevel })}>
            <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
            <SelectContent>{EDU.map(e => <SelectItem key={e.v} value={e.v}>{e.n}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="الاختصاص"><Input value={draft.specialization || ""} onChange={(e) => setDraft({ ...draft, specialization: e.target.value })} /></Field>
        <Field label="سنة التخرج"><Input type="number" value={draft.graduationYear ?? ""} onChange={(e) => setDraft({ ...draft, graduationYear: e.target.value ? Number(e.target.value) : undefined })} /></Field>
        <Field label="الجامعة/المعهد"><Input value={draft.university || ""} onChange={(e) => setDraft({ ...draft, university: e.target.value })} /></Field>
      </FormSection>

      <FormSection title="المعلومات المصرفية">
        <Field label="المصرف"><Input value={draft.bankName || ""} onChange={(e) => setDraft({ ...draft, bankName: e.target.value })} /></Field>
        <Field label="رقم الحساب"><Input value={draft.bankAccount || ""} onChange={(e) => setDraft({ ...draft, bankAccount: e.target.value })} /></Field>
        <Field label="IBAN"><Input value={draft.iban || ""} onChange={(e) => setDraft({ ...draft, iban: e.target.value })} /></Field>
      </FormSection>

      <div className="rounded-2xl bg-card border border-border p-5">
        <Label className="mb-2 block">نبذة</Label>
        <Textarea rows={3} value={draft.bio || ""} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, tone, children }: { icon: React.ComponentType<{ className?: string }>; title: string; tone: "primary" | "info" | "amber" | "success"; children: React.ReactNode }) {
  const map = { primary: "bg-primary/10 text-primary", info: "bg-info/10 text-info", amber: "bg-amber/15 text-amber", success: "bg-success/10 text-success" }[tone];
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`size-9 rounded-xl flex items-center justify-center ${map}`}><Icon className="size-4" /></div>
        <h4 className="font-bold">{title}</h4>
      </div>
      <dl className="space-y-2.5">{children}</dl>
    </div>
  );
}
function Row({ label, value, arabic, full }: { label: string; value?: string; arabic?: boolean; full?: boolean }) {
  return (
    <div className={`flex ${full ? "flex-col gap-1" : "items-center justify-between gap-3"} text-sm`}>
      <dt className="text-muted-foreground shrink-0">{label}</dt>
      <dd className={`font-medium ${arabic ? "arabic-num" : ""} ${value ? "" : "text-muted-foreground/50"}`}>{value || "—"}</dd>
    </div>
  );
}
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <h4 className="font-bold mb-4">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}
function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "md:col-span-2" : ""}><Label className="mb-1.5 block text-xs">{label}</Label>{children}</div>;
}
