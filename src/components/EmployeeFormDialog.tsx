import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Employee } from "@/lib/types";
import { useDepartments, useJobTitles, usePositions } from "@/lib/data-init";
import { uid } from "@/lib/storage";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employee: Employee | null;
  onSave: (e: Employee) => void;
}

const empty: Omit<Employee, "id" | "createdAt"> = {
  empNo: "", fullName: "", nationalId: "", phone: "", birthDate: "", gender: "male",
  jobTitle: "", position: "", departmentId: "", grade: 7, stage: 1, startDate: "",
  status: "active", notes: "",
};

export function EmployeeFormDialog({ open, onOpenChange, employee, onSave }: Props) {
  const [departments] = useDepartments();
  const [jobTitles] = useJobTitles();
  const [form, setForm] = useState<Omit<Employee, "id" | "createdAt">>(empty);

  useEffect(() => {
    if (employee) {
      const { id, createdAt, ...rest } = employee;
      setForm(rest);
    } else {
      setForm({ ...empty, empNo: `EMP${String(Math.floor(Math.random() * 9000) + 1000)}`, startDate: new Date().toISOString().slice(0, 10) });
    }
  }, [employee, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.empNo || !form.departmentId) return;
    onSave({
      ...(form as Omit<Employee, "id" | "createdAt">),
      id: employee?.id || uid("emp_"),
      createdAt: employee?.createdAt || new Date().toISOString(),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl">{employee ? "تعديل بيانات موظف" : "إضافة موظف جديد"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <Field label="الاسم الرباعي *">
            <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </Field>
          <Field label="الرقم الوظيفي *">
            <Input value={form.empNo} onChange={(e) => setForm({ ...form, empNo: e.target.value })} required />
          </Field>
          <Field label="رقم الهوية">
            <Input value={form.nationalId} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} />
          </Field>
          <Field label="رقم الهاتف">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="تاريخ الميلاد">
            <Input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
          </Field>
          <Field label="الجنس">
            <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as "male" | "female" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">ذكر</SelectItem>
                <SelectItem value="female">أنثى</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="القسم *">
            <Select value={form.departmentId} onValueChange={(v) => setForm({ ...form, departmentId: v })}>
              <SelectTrigger><SelectValue placeholder="اختر قسماً" /></SelectTrigger>
              <SelectContent>
                {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="العنوان الوظيفي">
            <JobTitleCombobox
              value={form.jobTitle}
              onChange={(name, defaultGrade) =>
                setForm((f) => ({
                  ...f,
                  jobTitle: name,
                  grade: defaultGrade ?? f.grade,
                }))
              }
            />
          </Field>
          <Field label="الدرجة (1-11)">
            <Input type="number" min={1} max={11} value={form.grade} onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })} />
          </Field>
          <Field label="المرحلة (1-10)">
            <Input type="number" min={1} max={10} value={form.stage} onChange={(e) => setForm({ ...form, stage: Number(e.target.value) })} />
          </Field>
          <Field label="تاريخ المباشرة">
            <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </Field>
          <Field label="الحالة">
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Employee["status"] })}>
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
          </Field>
          <div className="md:col-span-2">
            <Field label="ملاحظات">
              <Textarea value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            </Field>
          </div>
          <DialogFooter className="md:col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground border-0">حفظ</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground">{label}</Label>
      {children}
    </div>
  );
}

function JobTitleCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (name: string, defaultGrade?: number) => void;
}) {
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
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected ? `${selected.name} (د.${selected.defaultGrade})` : "اختر عنواناً وظيفياً..."}
          </span>
          <ChevronsUpDown className="size-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" dir="rtl">
        <Command
          filter={(itemValue, search) =>
            itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
          }
        >
          <CommandInput placeholder="ابحث بالاسم أو التصنيف..." />
          <CommandList className="max-h-72">
            <CommandEmpty>لا توجد نتائج.</CommandEmpty>
            {Object.entries(groups).map(([cat, items]) => (
              <CommandGroup key={cat} heading={cat}>
                {items.map((j) => (
                  <CommandItem
                    key={j.id}
                    value={`${j.name} ${j.category ?? ""} ${j.code}`}
                    onSelect={() => {
                      onChange(j.name, j.defaultGrade);
                      setOpen(false);
                    }}
                  >
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
