import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Briefcase, User, MapPin, Phone, GraduationCap, Landmark, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Employee, EmployeeProfile, MaritalStatus, BloodType, EducationLevel } from "@/lib/types";
import { useDepartments, useJobTitles, usePositions, useEmployees, useEmployeeProfiles } from "@/lib/data-init";
import { uid } from "@/lib/storage";
import { toast } from "sonner";

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

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employee: Employee | null; // null => create new
}

const emptyEmp: Omit<Employee, "id" | "createdAt"> = {
  empNo: "", fullName: "", nationalId: "", phone: "", birthDate: "", gender: "male",
  jobTitle: "", position: "", departmentId: "", grade: 7, stage: 1, startDate: "",
  status: "active", notes: "",
};

export function EmployeeUnifiedEditDialog({ open, onOpenChange, employee }: Props) {
  const [departments] = useDepartments();
  const [, setEmployees] = useEmployees();
  const [profiles, setProfiles] = useEmployeeProfiles();

  const [tab, setTab] = useState("job");
  const [emp, setEmp] = useState<Omit<Employee, "id" | "createdAt">>(emptyEmp);
  const [profile, setProfile] = useState<EmployeeProfile>({ employeeId: "", updatedAt: "" });

  useEffect(() => {
    if (!open) return;
    setTab("job");
    if (employee) {
      const { id, createdAt, ...rest } = employee;
      setEmp(rest);
      const p = profiles.find((x) => x.employeeId === employee.id);
      setProfile(p || { employeeId: employee.id, updatedAt: new Date().toISOString() });
    } else {
      setEmp({ ...emptyEmp, empNo: `EMP${String(Math.floor(Math.random() * 9000) + 1000)}`, startDate: new Date().toISOString().slice(0, 10) });
      setProfile({ employeeId: "", updatedAt: new Date().toISOString() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, employee?.id]);

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => setProfile((d) => ({ ...d, avatarDataUrl: r.result as string }));
    r.readAsDataURL(f);
  }

  function save() {
    if (!emp.fullName || !emp.empNo || !emp.departmentId) {
      toast.error("الاسم، الرقم الوظيفي، والقسم حقول مطلوبة");
      setTab("job");
      return;
    }
    const id = employee?.id || uid("emp_");
    const finalEmp: Employee = {
      ...emp,
      id,
      createdAt: employee?.createdAt || new Date().toISOString(),
    };
    setEmployees((prev) => {
      const exists = prev.some((x) => x.id === id);
      return exists ? prev.map((x) => x.id === id ? finalEmp : x) : [finalEmp, ...prev];
    });

    const finalProfile: EmployeeProfile = { ...profile, employeeId: id, updatedAt: new Date().toISOString() };
    setProfiles((prev) => {
      const idx = prev.findIndex((p) => p.employeeId === id);
      if (idx >= 0) { const c = [...prev]; c[idx] = finalProfile; return c; }
      return [finalProfile, ...prev];
    });

    toast.success(employee ? "تم حفظ التعديلات" : "تم إضافة الموظف");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col overflow-hidden" dir="rtl">
        <DialogHeader className="px-6 pt-5 pb-3 shrink-0 border-b border-border">
          <DialogTitle className="text-xl">
            {employee ? `تعديل ملف: ${employee.fullName}` : "إضافة موظف جديد"}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">جميع بيانات الموظف في مكان واحد — تنقّل بين التبويبات وفي النهاية اضغط "حفظ".</p>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-3 shrink-0">
            <TabsList className="w-full h-auto flex-wrap gap-1 bg-muted/50 p-1 rounded-xl">
              <Trig v="job" icon={Briefcase}>وظيفية</Trig>
              <Trig v="personal" icon={User}>شخصية</Trig>
              <Trig v="address" icon={MapPin}>العنوان</Trig>
              <Trig v="contact" icon={Phone}>اتصال وطوارئ</Trig>
              <Trig v="education" icon={GraduationCap}>تعليم</Trig>
              <Trig v="bank" icon={Landmark}>مصرفية</Trig>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y px-6 py-5">
            {/* JOB */}
            <TabsContent value="job" className="m-0 space-y-4">
              <Grid>
                <F label="الاسم الرباعي *">
                  <Input value={emp.fullName} onChange={(e) => setEmp({ ...emp, fullName: e.target.value })} />
                </F>
                <F label="الرقم الوظيفي *">
                  <Input value={emp.empNo} onChange={(e) => setEmp({ ...emp, empNo: e.target.value })} />
                </F>
                <F label="رقم الهوية">
                  <Input value={emp.nationalId} onChange={(e) => setEmp({ ...emp, nationalId: e.target.value })} />
                </F>
                <F label="رقم الهاتف">
                  <Input value={emp.phone} onChange={(e) => setEmp({ ...emp, phone: e.target.value })} />
                </F>
                <F label="تاريخ الميلاد">
                  <Input type="date" value={emp.birthDate} onChange={(e) => setEmp({ ...emp, birthDate: e.target.value })} />
                </F>
                <F label="الجنس">
                  <Select value={emp.gender} onValueChange={(v) => setEmp({ ...emp, gender: v as "male" | "female" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                </F>
                <F label="القسم *">
                  <Select value={emp.departmentId} onValueChange={(v) => setEmp({ ...emp, departmentId: v })}>
                    <SelectTrigger><SelectValue placeholder="اختر قسماً" /></SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </F>
                <F label="العنوان الوظيفي">
                  <JobTitleCombobox
                    value={emp.jobTitle}
                    onChange={(name, defaultGrade) =>
                      setEmp((f) => ({ ...f, jobTitle: name, grade: defaultGrade ?? f.grade }))
                    }
                  />
                </F>
                <F label="المنصب الإداري (اختياري)">
                  <PositionSelect value={emp.position || ""} onChange={(name) => setEmp((f) => ({ ...f, position: name }))} />
                </F>
                <F label="الدرجة (1-11)">
                  <Input type="number" min={1} max={11} value={emp.grade} onChange={(e) => setEmp({ ...emp, grade: Number(e.target.value) })} />
                </F>
                <F label="المرحلة (1-10)">
                  <Input type="number" min={1} max={10} value={emp.stage} onChange={(e) => setEmp({ ...emp, stage: Number(e.target.value) })} />
                </F>
                <F label="تاريخ المباشرة">
                  <Input type="date" value={emp.startDate} onChange={(e) => setEmp({ ...emp, startDate: e.target.value })} />
                </F>
                <F label="الحالة">
                  <Select value={emp.status} onValueChange={(v) => setEmp({ ...emp, status: v as Employee["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">مستمر</SelectItem>
                      <SelectItem value="seconded">منسب</SelectItem>
                      <SelectItem value="assigned">تكليف</SelectItem>
                      <SelectItem value="retired">متقاعد</SelectItem>
                      <SelectItem value="dismissed">مفصول</SelectItem>
                      <SelectItem value="contract_ended">انهاء عقد</SelectItem>
                      <SelectItem value="resigned">مستقيل</SelectItem>
                      <SelectItem value="deceased">متوفي</SelectItem>
                    </SelectContent>
                  </Select>
                </F>
                <F label="ملاحظات" full>
                  <Textarea rows={2} value={emp.notes || ""} onChange={(e) => setEmp({ ...emp, notes: e.target.value })} />
                </F>
              </Grid>
            </TabsContent>

            {/* PERSONAL */}
            <TabsContent value="personal" className="m-0 space-y-4">
              <div className="rounded-2xl bg-muted/40 border border-border p-4">
                <Label className="mb-2 block text-xs font-semibold">الصورة الشخصية</Label>
                <div className="flex items-center gap-4">
                  <div className="size-20 rounded-2xl bg-card overflow-hidden flex items-center justify-center border border-border">
                    {profile.avatarDataUrl
                      ? <img src={profile.avatarDataUrl} alt="" className="w-full h-full object-cover" />
                      : <Camera className="size-7 text-muted-foreground" />}
                  </div>
                  <Input type="file" accept="image/*" onChange={handleAvatar} className="max-w-xs" />
                </div>
              </div>
              <Grid>
                <F label="اسم الأم"><Input value={profile.motherName || ""} onChange={(e) => setProfile({ ...profile, motherName: e.target.value })} /></F>
                <F label="الحالة الاجتماعية">
                  <Select value={profile.maritalStatus || ""} onValueChange={(v) => setProfile({ ...profile, maritalStatus: v as MaritalStatus })}>
                    <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                    <SelectContent>{MARITAL.map(m => <SelectItem key={m.v} value={m.v}>{m.n}</SelectItem>)}</SelectContent>
                  </Select>
                </F>
                <F label="عدد الأولاد">
                  <Input type="number" min={0} value={profile.childrenCount ?? ""} onChange={(e) => setProfile({ ...profile, childrenCount: e.target.value ? Number(e.target.value) : undefined })} />
                </F>
                <F label="فصيلة الدم">
                  <Select value={profile.bloodType || ""} onValueChange={(v) => setProfile({ ...profile, bloodType: v as BloodType })}>
                    <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                    <SelectContent>{BLOOD.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </F>
                <F label="الديانة"><Input value={profile.religion || ""} onChange={(e) => setProfile({ ...profile, religion: e.target.value })} /></F>
                <F label="الجنسية"><Input value={profile.nationality || ""} onChange={(e) => setProfile({ ...profile, nationality: e.target.value })} placeholder="عراقية" /></F>
                <F label="رقم البطاقة المدنية"><Input value={profile.civilStatusId || ""} onChange={(e) => setProfile({ ...profile, civilStatusId: e.target.value })} /></F>
                <F label="رقم جواز السفر"><Input value={profile.passportNo || ""} onChange={(e) => setProfile({ ...profile, passportNo: e.target.value })} /></F>
                <F label="بطاقة السكن"><Input value={profile.residenceCardNo || ""} onChange={(e) => setProfile({ ...profile, residenceCardNo: e.target.value })} /></F>
                <F label="نبذة" full><Textarea rows={3} value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></F>
              </Grid>
            </TabsContent>

            {/* ADDRESS */}
            <TabsContent value="address" className="m-0 space-y-4">
              <Grid>
                <F label="المحافظة"><Input value={profile.governorate || ""} onChange={(e) => setProfile({ ...profile, governorate: e.target.value })} /></F>
                <F label="القضاء/المنطقة"><Input value={profile.district || ""} onChange={(e) => setProfile({ ...profile, district: e.target.value })} /></F>
                <F label="العنوان التفصيلي" full><Textarea rows={2} value={profile.address || ""} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></F>
              </Grid>
            </TabsContent>

            {/* CONTACT */}
            <TabsContent value="contact" className="m-0 space-y-4">
              <Grid>
                <F label="هاتف بديل"><Input value={profile.altPhone || ""} onChange={(e) => setProfile({ ...profile, altPhone: e.target.value })} /></F>
                <F label="البريد الإلكتروني"><Input type="email" value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></F>
                <F label="جهة الاتصال للطوارئ"><Input value={profile.emergencyContactName || ""} onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })} /></F>
                <F label="هاتف الطوارئ"><Input value={profile.emergencyContactPhone || ""} onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })} /></F>
                <F label="صلة القرابة"><Input value={profile.emergencyContactRelation || ""} onChange={(e) => setProfile({ ...profile, emergencyContactRelation: e.target.value })} /></F>
              </Grid>
            </TabsContent>

            {/* EDUCATION */}
            <TabsContent value="education" className="m-0 space-y-4">
              <Grid>
                <F label="المستوى">
                  <Select value={profile.educationLevel || ""} onValueChange={(v) => setProfile({ ...profile, educationLevel: v as EducationLevel })}>
                    <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                    <SelectContent>{EDU.map(x => <SelectItem key={x.v} value={x.v}>{x.n}</SelectItem>)}</SelectContent>
                  </Select>
                </F>
                <F label="الاختصاص"><Input value={profile.specialization || ""} onChange={(e) => setProfile({ ...profile, specialization: e.target.value })} /></F>
                <F label="سنة التخرج"><Input type="number" value={profile.graduationYear ?? ""} onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value ? Number(e.target.value) : undefined })} /></F>
                <F label="الجامعة/المعهد"><Input value={profile.university || ""} onChange={(e) => setProfile({ ...profile, university: e.target.value })} /></F>
              </Grid>
            </TabsContent>

            {/* BANK */}
            <TabsContent value="bank" className="m-0 space-y-4">
              <Grid>
                <F label="المصرف"><Input value={profile.bankName || ""} onChange={(e) => setProfile({ ...profile, bankName: e.target.value })} /></F>
                <F label="رقم الحساب"><Input value={profile.bankAccount || ""} onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })} /></F>
                <F label="IBAN" full><Input value={profile.iban || ""} onChange={(e) => setProfile({ ...profile, iban: e.target.value })} /></F>
              </Grid>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="px-6 py-3 border-t border-border shrink-0 bg-muted/30">
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button onClick={save} className="gradient-primary text-primary-foreground border-0">حفظ جميع التغييرات</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Trig({ v, icon: Icon, children }: { v: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <TabsTrigger value={v} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg gap-1.5 text-xs">
      <Icon className="size-3.5" />{children}
    </TabsTrigger>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}
function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={cn("space-y-1.5", full && "md:col-span-2")}>
      <Label className="text-xs font-semibold">{label}</Label>
      {children}
    </div>
  );
}

function JobTitleCombobox({ value, onChange }: { value: string; onChange: (name: string, defaultGrade?: number) => void }) {
  const [jobTitles] = useJobTitles();
  const [open, setOpen] = useState(false);
  const groups = jobTitles.reduce<Record<string, typeof jobTitles>>((acc, j) => {
    const k = j.category || "أخرى";
    (acc[k] ||= []).push(j);
    return acc;
  }, {});
  const selected = jobTitles.find((j) => j.name === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" className="w-full justify-between font-normal">
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected ? `${selected.name} (د.${selected.defaultGrade})` : "اختر عنواناً وظيفياً..."}
          </span>
          <ChevronsUpDown className="size-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" dir="rtl">
        <Command filter={(itemValue, search) => itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0}>
          <CommandInput placeholder="ابحث..." />
          <CommandList className="max-h-72">
            <CommandEmpty>لا توجد نتائج.</CommandEmpty>
            {Object.entries(groups).map(([cat, items]) => (
              <CommandGroup key={cat} heading={cat}>
                {items.map((j) => (
                  <CommandItem key={j.id} value={`${j.name} ${j.category ?? ""} ${j.code}`} onSelect={() => { onChange(j.name, j.defaultGrade); setOpen(false); }}>
                    <Check className={cn("ml-2 size-4", value === j.name ? "opacity-100" : "opacity-0")} />
                    <span className="flex-1">{j.name}</span>
                    <span className="text-xs text-muted-foreground arabic-num">د.{j.defaultGrade}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function PositionSelect({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const [positions] = usePositions();
  return (
    <Select value={value || "__none__"} onValueChange={(v) => onChange(v === "__none__" ? "" : v)}>
      <SelectTrigger><SelectValue placeholder="بدون منصب إداري" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="__none__">— بدون منصب —</SelectItem>
        {positions.map((p) => (
          <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
