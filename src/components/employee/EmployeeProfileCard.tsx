import { User, Heart, GraduationCap, Landmark, MapPin, Phone } from "lucide-react";
import { useEmployeeProfiles } from "@/lib/data-init";
import type { MaritalStatus, BloodType, EducationLevel } from "@/lib/types";

const MARITAL: Record<MaritalStatus, string> = {
  single: "أعزب", married: "متزوج", divorced: "مطلق", widowed: "أرمل",
};
const EDU: Record<EducationLevel, string> = {
  primary: "ابتدائية", intermediate: "متوسطة", preparatory: "إعدادية", diploma: "دبلوم",
  bachelor: "بكالوريوس", higher_diploma: "دبلوم عالي", master: "ماجستير", phd: "دكتوراه",
};

export function EmployeeProfileCard({ employeeId }: { employeeId: string }) {
  const [profiles] = useEmployeeProfiles();
  const p = profiles.find((x) => x.employeeId === employeeId);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section icon={User} title="معلومات شخصية" tone="primary">
          <Row label="اسم الأم" value={p?.motherName} />
          <Row label="الحالة الاجتماعية" value={p?.maritalStatus ? MARITAL[p.maritalStatus] : undefined} />
          <Row label="عدد الأولاد" value={p?.childrenCount?.toString()} arabic />
          <Row label="فصيلة الدم" value={p?.bloodType as BloodType | undefined} arabic />
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
          <Row label="المستوى" value={p?.educationLevel ? EDU[p.educationLevel] : undefined} />
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
          <p className="text-sm text-muted-foreground">لا توجد معلومات تفصيلية بعد — اضغط زر "تعديل ملف الموظف" في الأعلى لإضافتها.</p>
        </div>
      )}
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
