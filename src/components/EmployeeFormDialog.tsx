import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Employee } from "@/lib/types";
import { useDepartments, useJobTitles } from "@/lib/data-init";
import { uid } from "@/lib/storage";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employee: Employee | null;
  onSave: (e: Employee) => void;
}

const empty: Omit<Employee, "id" | "createdAt"> = {
  empNo: "", fullName: "", nationalId: "", phone: "", birthDate: "", gender: "male",
  jobTitle: "", departmentId: "", grade: 7, stage: 1, startDate: "",
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
            <Select value={form.jobTitle} onValueChange={(v) => setForm({ ...form, jobTitle: v })}>
              <SelectTrigger><SelectValue placeholder="اختر عنواناً" /></SelectTrigger>
              <SelectContent>
                {jobTitles.map((j) => <SelectItem key={j.id} value={j.name}>{j.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="الدرجة (1-10)">
            <Input type="number" min={1} max={10} value={form.grade} onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })} />
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
